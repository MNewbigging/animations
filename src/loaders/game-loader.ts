import * as THREE from "three";
import { action, makeAutoObservable, observable } from "mobx";

import { ModelLoader } from "./model-loader";

export class GameLoader {
  @observable loading = false;

  readonly modelLoader = new ModelLoader();

  private onLoad?: () => void;

  constructor() {
    makeAutoObservable(this);
    THREE.Cache.enabled = true;
  }

  @action load(onLoad: () => void) {
    this.onLoad = onLoad;

    this.loading = true;

    this.modelLoader.load(this.onLoaderFinish);
  }

  private onLoaderFinish = () => {
    // Simply check if all loaders have finished now
    if (!this.modelLoader.loading) {
      this.loading = false;
      this.onLoad?.();
    }
  };
}
