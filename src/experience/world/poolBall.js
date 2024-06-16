import * as THREE from "three";
import Experience from "../experience.js";

export default class poolBall {
  constructor(position) {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setGeometry();
    this.setMaterial();
    this.setMesh(position);

    this.CannonWorld = this.experience.cannonWorld
    this.CannonWorld.addPoolBall(this.mesh, position)
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(0.0235, 20 ,20); 
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({});
  }

  setMesh(position) {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.position.copy(position)
    this.scene.add(this.mesh);
  }
}