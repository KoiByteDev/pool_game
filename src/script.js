import * as THREE from "three";
import GUI from "lil-gui";
import CANNON from "cannon";
import { gltfLoader, textureLoader } from "./experience/utils/utils.js";
import { scene, camera, controls, renderer } from "./experience/experience.js";
import { wallMaterial, tableMaterial, world } from "./experience/world.js";
import { poolBalls, objectsToUpdate } from "./experience/objects/poolBalls.js";
import { floor } from "./experience/objects/floor.js";
import { createPoolTable } from "./experience/objects/poolTable.js";
import { createPoolCue } from "./experience/objects/poolCue.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
const ballHit = {};
const indexes = {};
indexes.angle = 180;
indexes.force = 500;

createPoolTable(gltfLoader, scene, world, tableMaterial, wallMaterial);
const { cueModel, tipMesh, tipBody } = await createPoolCue(gltfLoader);
console.log(tipBody)

const resetWhite = () => {
  poolBalls.whiteBall.body.position.set(0.3, 1, 0),
    poolBalls.whiteBall.body.velocity.set(0, 0, 0);
  poolBalls.whiteBall.body.angularVelocity.set(0, 0, 0);
};

ballHit.resetWhite = resetWhite;

window.addEventListener("keypress", (e) => {
  if (e.code === "Space") {
    const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);

    const valX = Math.cos(angleInRadians) * indexes.force;
    const valZ = Math.sin(angleInRadians) * indexes.force;
    poolBalls.whiteBall.body.applyForce(
      new CANNON.Vec3(valX, 0, valZ),
      poolBalls.whiteBall.body.position
    );
  }
});

window.addEventListener("keydown", (e) => {
  if (e.code === "KeyA") {
    indexes.angle += 1;
    console.log(indexes.angle)
  } else if (e.code === "KeyD") {
    indexes.angle -= 1;
    console.log(indexes.angle)
  }
});



const updateCuePosition = () => {
  const angleInRadians = (Math.PI / 180) * indexes.angle
  const distanceFromBall = 1;
  const whiteBallPosition = poolBalls.whiteBall.body.position;
  const cueX = whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
  const cueZ = whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;
  cueModel.position.set(cueX, cueModel.position.y, cueZ);
  cueModel.lookAt(new THREE.Vector3(whiteBallPosition.x, whiteBallPosition.y, whiteBallPosition.z));
}

gui.add(ballHit, "resetWhite");
gui.add(indexes, "angle").min(0).max(360).step(1);
gui.add(indexes, "force").min(10).max(1000).step(10);

scene.add(floor);

const axesHelper = new THREE.AxesHelper();
axesHelper.position.y += 1;
scene.add(axesHelper);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update Physics World
  world.step(1 / 60, deltaTime, 3);
  
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  updateCuePosition();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
