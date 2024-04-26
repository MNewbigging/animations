import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameLoader } from "./loaders/game-loader";
import { addGui } from "./utils/utils";

interface AnimatedCharacter {
  object: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: THREE.AnimationAction[];
  currentAction: THREE.AnimationAction;
}

export class GameState {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private characters: AnimatedCharacter[] = [];
  private currentCharacter: AnimatedCharacter;
  private floor: THREE.Mesh;

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

    // Setup floor
    this.floor = this.createFloor();
    this.scene.add(this.floor);

    // Setup animated character for dummy
    const dummyChar = this.getAnimatedCharacter("dummy");
    this.characters.push(dummyChar);

    // This is the current character
    this.currentCharacter = dummyChar;
    this.scene.add(dummyChar.object);
    this.currentCharacter.mixer.addEventListener(
      "finished",
      this.onAnimationEnd
    );

    // Start the default animation
    console.log(
      "starting default current action: ",
      dummyChar.currentAction.getClip().name
    );
    dummyChar.currentAction.play();

    // Start game
    this.clock.start();
    this.update();
  }

  // From a game-ui button
  requestAnimation(name: string) {
    // Only start if not currently playing that animation
    if (this.currentCharacter.currentAction.getClip().name !== name) {
      this.playAnimation(name, this.currentCharacter);
    }
  }

  // Doesn't seem to be a type for this event type
  private onAnimationEnd = (e: any) => {
    // Check if we since started playing a different anim when this one started
    const name = (e.action as THREE.AnimationAction).getClip().name;
    if (name === this.currentCharacter.currentAction.getClip().name) {
      // No new anim was started, can revert to idle
      this.playAnimation("idle", this.currentCharacter);
    }
  };

  private getAnimatedCharacter(name: string): AnimatedCharacter {
    const object = this.gameLoader.modelLoader.get(name);

    const mixer = new THREE.AnimationMixer(object);

    // Create actions from all clips
    const actions = this.gameLoader.animLoader.createActions(mixer);

    // Set to idle by default
    const currentAction = actions[0];

    return { object, mixer, actions, currentAction };
  }

  private playAnimation(name: string, character: AnimatedCharacter) {
    // Find the new action with the given name
    const nextAction = this.getAction(name, character.actions);
    if (!nextAction) {
      throw Error(
        "Could not find action with name " + name + "for character " + character
      );
    }

    console.log("playing animation", name);

    // Reset the next action then fade to it from the current action
    nextAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .crossFadeFrom(character.currentAction, 1, false)
      .play();

    // Next is now current
    character.currentAction = nextAction;
  }

  private getAction(
    name: string,
    actions: THREE.AnimationAction[]
  ): THREE.AnimationAction | undefined {
    return actions.find((action) => action.getClip().name === name);
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

  private createFloor() {
    const size = 10;
    const geom = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial();

    const texture = this.gameLoader.modelLoader.textureLoader.get("grid");
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.repeat.set(size / 2, size / 2);
      mat.map = texture;
    }

    const floor = new THREE.Mesh(geom, mat);
    floor.rotateX(-Math.PI / 2);

    return floor;
  }
}
