import * as THREE from "three";
import { action, makeAutoObservable, observable } from "mobx";

import { ModelLoader } from "./model-loader";
import { AnimLoader } from "./anim-loader";

export class GameLoader {
  @observable loading = false;

  readonly modelLoader = new ModelLoader();
  readonly animLoader = new AnimLoader();

  private onLoad?: () => void;

  constructor() {
    makeAutoObservable(this);
    THREE.Cache.enabled = true;
  }

  @action load(onLoad: () => void) {
    this.onLoad = onLoad;

    this.loading = true;

    this.modelLoader.load(this.onLoaderFinish);
    this.animLoader.load(this.onLoaderFinish);
  }

  private onLoaderFinish = () => {
    // Simply check if all loaders have finished now
    if (this.modelLoader.doneLoading && this.animLoader.doneLoading) {
      this.loading = false;
      this.onLoad?.();
    }
  };
}
