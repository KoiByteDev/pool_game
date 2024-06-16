import * as THREE from "three";
import Experience from "../experience";
import poolBall from "./poolBall";
import Environment from "./Environment";
import CannonWorld from "./Physics/cannonWorld";
import PoolTable from "./PoolTable";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.cannonWorld = this.experience.cannonWorld;

    this.whiteBall = new poolBall({ x: 0, y: 1, z: 0 });
    this.blackBall = new poolBall({ x: 0.04, y: 2, z: 0 })
    this.poolTABLE = new PoolTable()
    this.environment = new Environment();
  }

  update(deltaTime) {
    this.cannonWorld.update(deltaTime);

    for (const object of this.cannonWorld.objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }
  }
}
