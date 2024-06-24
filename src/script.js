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
import { gsap } from "gsap/gsap-core";

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
const { cueModel } = await createPoolCue(gltfLoader);

const resetWhite = () => {
  poolBalls.whiteBall.body.position.set(0.3, 1, 0),
    poolBalls.whiteBall.body.velocity.set(0, 0, 0);
  poolBalls.whiteBall.body.angularVelocity.set(0, 0, 0);
};

ballHit.resetWhite = resetWhite;

const GameState = {
  IDLE: 'idle',
  HIT_BALL: 'hit_ball',
  MOVE_CUE_UP: 'move_cue_up',
  HOLD: 'hold'
}

let currentState = GameState.IDLE;

window.addEventListener("keypress", (e) => {
  if (e.code === "Space" && currentState === GameState.IDLE) {
    const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);
    currentState = GameState.HIT_BALL;
    console.log( 80 / indexes.force)
    gsap.to(cueModel.position, {
      duration: 1,
      x: poolBalls.whiteBall.body.position.x - Math.cos(angleInRadians) * 1.1,
      z: poolBalls.whiteBall.body.position.z - Math.sin(angleInRadians) * 1.1,
      onComplete: () => {
        gsap.to(cueModel.position, {
          duration: 80 / (indexes.force),
          x: poolBalls.whiteBall.body.position.x - Math.cos(angleInRadians) * 0.95,
          z: poolBalls.whiteBall.body.position.z - Math.sin(angleInRadians) * 0.95,
          onComplete: () => {
            const forceX = Math.cos(angleInRadians) * indexes.force;
            const forceZ = Math.sin(angleInRadians) * indexes.force;
            poolBalls.whiteBall.body.applyForce(
              new CANNON.Vec3(forceX, 0, forceZ),
              poolBalls.whiteBall.body.position
            );
            gsap.to(cueModel.position, {
              duration: 1 ,
              y: cueModel.position.y + 1,
              onComplete: () => {
                currentState = GameState.HOLD;
              },
            });
          },
        });
      },
    });
  }
});

window.addEventListener("keydown", (e) => {
  if (currentState === GameState.IDLE) {
    console.log(e.code)
    if (e.code === "KeyA") {
      indexes.angle += 1;
      console.log(indexes.angle)
    } else if (e.code === "KeyD") {
      indexes.angle -= 1;
      console.log(indexes.angle)
    }
  }
  if (e.code === "Enter" && currentState === GameState.HOLD) {
    const angleInRadians = (Math.PI / 180) * indexes.angle
    const distanceFromBall = 1.05;
    const whiteBallPosition = poolBalls.whiteBall.body.position;
    const cueX = whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
    const cueZ = whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;
    gsap.to(cueModel.position, {
      duration: 0.5,
      x: cueX,
      y: 0.72,
      z: cueZ,
      onComplete: () => {
        currentState = GameState.IDLE;
      }
    })
    console.log(currentState)
  }
});



const updateCuePosition = () => {
  const angleInRadians = (Math.PI / 180) * indexes.angle
  const distanceFromBall = 1.05;
  const whiteBallPosition = poolBalls.whiteBall.body.position;
  const cueX = whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
  const cueZ = whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;
  cueModel.position.set(cueX, cueModel.position.y, cueZ);
  cueModel.lookAt(new THREE.Vector3(whiteBallPosition.x, whiteBallPosition.y * 0.99, whiteBallPosition.z));
}

gui.add(ballHit, "resetWhite");
gui.add(indexes, "angle").min(0).max(360).step(1);
gui.add(indexes, "force").min(10).max(1000).step(10);

scene.add(floor);

// const axesHelper = new THREE.AxesHelper();
// axesHelper.position.y += 1;
// scene.add(axesHelper);

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

  if (currentState === GameState.IDLE) {
    updateCuePosition();
  } 

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
