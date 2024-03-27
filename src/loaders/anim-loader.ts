import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class AnimLoader {
  doneLoading = false;
  private clips = new Map<string, THREE.AnimationClip>();
  private loadingManager = new THREE.LoadingManager();

  getClips(names: string[]): THREE.AnimationClip[] {
    const clips: THREE.AnimationClip[] = [];

    names.forEach((name) => {
      const clip = this.clips.get(name);
      if (clip) {
        clips.push(clip);
      }
    });

    return clips;
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onError = (url) => console.error("error loading", url);

    this.loadingManager.onLoad = () => {
      this.doneLoading = true;
      onLoad();
    };

    // Start loading
    this.loadAnims();
  }

  private loadAnims() {
    const loader = new FBXLoader(this.loadingManager);

    this.loadWaving(loader);
  }

  private loadWaving(loader: FBXLoader) {
    const url = new URL("/animations/waving.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        this.clips.set("waving", clip);
      }
    });
  }
}
