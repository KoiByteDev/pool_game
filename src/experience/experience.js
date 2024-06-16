import * as THREE from "three";
import Time from "./utils/Time.js";
import Sizes from "./utils/sizes.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./world/world.js";
import CannonWorld from "./world/Physics/cannonWorld.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;

    window.experience = this;

    this.canvas = canvas;

    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.cannonWorld = new CannonWorld();
    this.world = new World();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update(this.time.delta);
  }
}
