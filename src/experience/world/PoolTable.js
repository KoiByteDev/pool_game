import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Experience from "../experience";

export default class PoolTable {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./models/Table/BilliardTable.glb", (gltf) => {
      console.log(gltf.scene.children);
      const children = [...gltf.scene.children];
      for (const child of children) {
        child.position.y = 0;
        child.position.x = 0;
        child.position.z = 0;
        child.receiveShadow = true;
        this.scene.add(child);
      }
    });

    this.CannonWorld = this.experience.cannonWorld;
    this.CannonWorld.addTable(this.mesh);
  }
}
