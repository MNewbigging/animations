import * as THREE from "three";

export class TextureLoader {
  readonly textures = new Map<string, THREE.Texture>();

  private loadingManager = new THREE.LoadingManager();

  get(name: string) {
    return this.textures.get(name);
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onError = (url) =>
      console.error("error loading texture", url);

    this.loadingManager.onLoad = () => {
      onLoad();
    };

    this.loadTextures();
  }

  private loadTextures() {
    const loader = new THREE.TextureLoader(this.loadingManager);

    this.loadDummyTexture(loader);
  }

  private loadDummyTexture(loader: THREE.TextureLoader) {
    const url = new URL("/textures/dummy.png", import.meta.url).href;
    loader.load(url, (texture) => this.textures.set("dummy", texture));
  }
}
