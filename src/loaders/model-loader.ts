import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "./texture-loader";

export class ModelLoader {
  loading = false;
  readonly models = new Map<string, THREE.Object3D>();

  private loadingManager = new THREE.LoadingManager();

  private textureLoader = new TextureLoader();

  get(modelName: string): THREE.Object3D {
    // Return the model if found
    const model = this.models.get(modelName);
    if (model) {
      return SkeletonUtils.clone(model);
    }

    // Otherwise create debug object and error message
    console.error(
      `Could not find ${modelName}, returning debug object instead`
    );
    return new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onError = (url) => console.error("error loading", url);

    this.loadingManager.onLoad = () => {
      this.loading = false;
      onLoad();
    };

    // Start loading
    this.loading = true;

    // If you need a texture atlas for the models, load it here first
    // remember to set texture.encoding = THREE.sRGBEncoding;
    // Then pass it to load models and on each model,
    // traverse each loaded model and assign material.map to atlas to each mesh child node

    // Load textures first
    this.textureLoader.load(this.loadModels);
  }

  private loadModels = () => {
    const loader = new FBXLoader(this.loadingManager);

    this.loadDummy(loader);
  };

  private loadDummy(loader: FBXLoader) {
    const url = new URL("/models/dummy.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Get the texture for this group
      const texture = this.textureLoader.get("dummy");
      if (texture) {
        this.applyCharacterTexture(group, texture);
      }

      // Scale the model
      this.scaleCharacterModel(group);

      // Add it
      this.models.set("dummy", group);
    });
  }

  private applyCharacterTexture(group: THREE.Group, texture: THREE.Texture) {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshLambertMaterial;
        mat.map = texture;
        mat.vertexColors = false;
      }
    });
  }

  private scaleCharacterModel(group: THREE.Group) {
    group.scale.multiplyScalar(0.01);
    group.updateMatrixWorld();
  }
}
