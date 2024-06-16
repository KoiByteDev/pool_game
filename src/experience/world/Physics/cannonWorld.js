import * as THREE from "three";
import CANNON, { Sphere } from "cannon";

export default class CannonWorld {
  constructor() {

    this.world = new CANNON.World();
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.gravity.set(0, -9.82, 0);

    // const defaultMaterial = new CANNON.Material("plastic");
    // const defaultContactMaterial = new CANNON.ContactMaterial(
    //   defaultMaterial,
    //   defaultMaterial,
    //   {
    //     friction: 0.5,
    //     restitution: 0,
    //   }
    // );
    // this.world.addContactMaterial(defaultContactMaterial);
    // this.world.defaultContactMaterial = defaultContactMaterial;

    this.objectsToUpdate = [];
  }

  addPoolBall(mesh, position) {
    const shape = new CANNON.Sphere(0.0235);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
    });
    body.position.copy(position)
    this.world.addBody(body);

    this.objectsToUpdate.push({
      mesh,
      body,
    });
  }

  addTable() {
    const shape = new CANNON.Plane();
    const body = new CANNON.Body();
    body.addShape(shape);
    body.position.y = 0;
    body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    this.world.addBody(body);
  }

  update(deltaTime) {
    this.world.step(1 / 60, deltaTime, 3);
  }
}
