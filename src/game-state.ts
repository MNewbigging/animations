import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameLoader } from "./loaders/game-loader";

interface AnimatedCharacter {
  object: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: THREE.AnimationAction[];
}

export class GameState {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private characters: AnimatedCharacter[] = [];
  private currentCharacter: AnimatedCharacter;

  constructor(
    private canvas: HTMLCanvasElement,
    private gameLoader: GameLoader
  ) {
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.camera.position.y = 1.3;

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    window.addEventListener("resize", this.onCanvasResize);
    this.onCanvasResize();

    // Setup scene
    this.scene.background = new THREE.Color("#1680AF");

    // Setup controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1.3, 0);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    const directLight = new THREE.DirectionalLight();
    this.scene.add(directLight);

    // Setup animated character for dummy
    const dummyChar = this.getAnimatedCharacter("dummy");
    this.characters.push(dummyChar);

    // This is the current character
    this.currentCharacter = dummyChar;
    this.scene.add(dummyChar.object);

    // Start the idle animation
    this.playAnimation("idle", dummyChar);

    // Start game
    this.clock.start();
    this.update();
  }

  // From a game-ui button
  requestAnimation(name: string) {
    if (this.currentCharacter) {
      this.playAnimation(name, this.currentCharacter);
    }
  }

  private getAnimatedCharacter(name: string): AnimatedCharacter {
    const object = this.gameLoader.modelLoader.get(name);

    const mixer = new THREE.AnimationMixer(object);
    const clips = this.gameLoader.animLoader.getClips(["waving", "idle"]);
    const actions = clips.map((clip) => mixer.clipAction(clip));

    return { object, mixer, actions };
  }

  private playAnimation(name: string, character: AnimatedCharacter) {
    const action = character.actions.find(
      (action) => action.getClip().name === name
    );
    action?.play();
  }

  private onCanvasResize = () => {
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;

    this.camera.updateProjectionMatrix();
  };

  private update = () => {
    const dt = this.clock.getDelta();

    this.controls.update();

    this.characters.forEach((char) => char.mixer.update(dt));

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.update);
  };
}
