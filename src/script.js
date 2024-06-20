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
indexes.angle = 0;
indexes.force = 500;

createPoolTable(gltfLoader, scene, world, tableMaterial, wallMaterial);
const cue = await createPoolCue(gltfLoader);

const resetWhite = () => {
  poolBalls.whiteBall.body.position.set(0.3, 1, 0),
    poolBalls.whiteBall.body.velocity.set(0, 0, 0);
  poolBalls.whiteBall.body.angularVelocity.set(0, 0, 0);
};

const hit = () => {
  const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);

  const valX = Math.cos(angleInRadians) * -indexes.force;
  const valZ = Math.sin(angleInRadians) * -indexes.force;

  // poolBalls.whiteBall.body.applyForce(
  //   new CANNON.Vec3(valX, 0, valZ),
  //   poolBalls.whiteBall.body.position
  // );

  cue.position.x -= 0.05;
};

ballHit.hit = hit;
ballHit.resetWhite = resetWhite;

gui.add(ballHit, "hit");
gui.add(ballHit, "resetWhite");
gui.add(indexes, "angle").min(0).max(360).step(1);
gui.add(indexes, "force").min(10).max(1000).step(10);

scene.add(floor);

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
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
