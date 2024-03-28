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

  createActions(mixer: THREE.AnimationMixer) {
    const actions: THREE.AnimationAction[] = [];

    const idleClip = this.clips.get("idle");
    if (idleClip) {
      const action = mixer.clipAction(idleClip);
      actions.push(action);
    }

    const wavingClip = this.clips.get("waving");
    if (wavingClip) {
      const action = mixer.clipAction(wavingClip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      actions.push(action);
    }

    const saluteClip = this.clips.get("salute");
    if (saluteClip) {
      const action = mixer.clipAction(saluteClip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      actions.push(action);
    }

    const walkingClip = this.clips.get("walking");
    if (walkingClip) {
      const action = mixer.clipAction(walkingClip);
      actions.push(action);
    }

    const slowRunClip = this.clips.get("slow-run");
    if (slowRunClip) {
      const action = mixer.clipAction(slowRunClip);
      actions.push(action);
    }

    const fastRunClip = this.clips.get("fast-run");
    if (fastRunClip) {
      const action = mixer.clipAction(fastRunClip);
      actions.push(action);
    }

    return actions;
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
    this.loadIdle(loader);
    this.loadSalute(loader);
    this.loadWalking(loader);
    this.loadSlowRun(loader);
    this.loadFastRun(loader);
  }

  private loadWaving(loader: FBXLoader) {
    const url = new URL("/animations/waving.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "waving";
        this.clips.set("waving", clip);
      }
    });
  }

  private loadIdle(loader: FBXLoader) {
    const url = new URL("/animations/idle.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "idle";
        this.clips.set("idle", clip);
      }
    });
  }

  private loadSalute(loader: FBXLoader) {
    const url = new URL("/animations/salute.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "salute";
        this.clips.set("salute", clip);
      }
    });
  }

  private loadWalking(loader: FBXLoader) {
    const url = new URL("/animations/walking.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "walking";
        this.clips.set("walking", clip);
      }
    });
  }

  private loadSlowRun(loader: FBXLoader) {
    const url = new URL("/animations/slow_run.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "slow-run";
        this.clips.set("slow-run", clip);
      }
    });
  }

  private loadFastRun(loader: FBXLoader) {
    const url = new URL("/animations/fast_run.fbx", import.meta.url).href;
    loader.load(url, (group) => {
      // Should only be one animation
      if (group.animations.length) {
        const clip = group.animations[0];
        clip.name = "fast-run";
        this.clips.set("fast-run", clip);
      }
    });
  }
}
