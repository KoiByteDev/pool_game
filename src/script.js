import * as THREE from "three";
import GUI from "lil-gui";
import CANNON from "cannon";
import { gltfLoader, textureLoader } from "./experience/utils/utils.js";
import { scene, camera, controls, renderer } from "./experience/experience.js";
import { wallMaterial, tableMaterial, world } from "./experience/world.js";
import {
  poolBalls,
  objectsToUpdate,
  StripedPoolBalls,
  FilledPoolBalls,
} from "./experience/objects/poolBalls.js";
import { floor } from "./experience/objects/floor.js";
import { createPoolTable } from "./experience/objects/poolTable.js";
import { cueModel } from "./experience/objects/poolCue.js";
import { gsap } from "gsap/gsap-core";

const ballHit = {};
const indexes = {};
indexes.angle = 180;
indexes.force = 450;

createPoolTable(gltfLoader, scene, world, tableMaterial, wallMaterial);

const resetWhite = () => {
  poolBalls.whiteBall.body.position.set(0.3, 1, 0);
  poolBalls.whiteBall.body.velocity.set(0, 0, 0);
  poolBalls.whiteBall.body.angularVelocity.set(0, 0, 0);
};

ballHit.resetWhite = resetWhite;

/**
 * Game States
 */
const GameState = {
  START_SCREEN: "start_screen",
  TWO_PLAYER_IDLE: "two_player_idle",
  TWO_PLAYER_HIT: "two_player_hit",
  TWO_PLAYER_BALL_MOVING: "two_player_ball_moving",
  SANDBOX_IDLE: "sandbox_idle",
  SANDBOX_HIT: "sandbox_hit",
  SANDBOX_BALL_MOVING: "sandbox_ball_moving",
};

const ScoreState = {
  NO_SCORE: "no_score",
  SCORE_P1_STRIPE: "p1_stripe",
  SCORE_P1_FILLED: "p1_filled",
};

let currentState = GameState.START_SCREEN;
let currentScore = GameState.NO_SCORE;

/**
 * Event Listeners
 */
window.addEventListener("keypress", (e) => {
  if (
    (currentState === GameState.TWO_PLAYER_IDLE ||
      currentState === GameState.SANDBOX_IDLE) &&
    e.code === "Space"
  ) {
    const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);
    currentState =
      currentState === GameState.TWO_PLAYER_IDLE
        ? GameState.TWO_PLAYER_HIT
        : GameState.SANDBOX_HIT;

    gsap.to(cueModel.position, {
      duration: 1,
      x: poolBalls.whiteBall.body.position.x - Math.cos(angleInRadians) * 1.1,
      z: poolBalls.whiteBall.body.position.z - Math.sin(angleInRadians) * 1.1,
      onComplete: () => {
        gsap.to(cueModel.position, {
          duration: 80 / indexes.force,
          x:
            poolBalls.whiteBall.body.position.x -
            Math.cos(angleInRadians) * 0.95,
          z:
            poolBalls.whiteBall.body.position.z -
            Math.sin(angleInRadians) * 0.95,
          onComplete: () => {
            const forceX = Math.cos(angleInRadians) * indexes.force;
            const forceZ = Math.sin(angleInRadians) * indexes.force;
            poolBalls.whiteBall.body.applyForce(
              new CANNON.Vec3(forceX, 0, forceZ),
              poolBalls.whiteBall.body.position
            );

            gsap.to(cueModel.position, {
              duration: 1,
              y: cueModel.position.y + 1,
              onComplete: () => {
                currentState =
                  currentState === GameState.TWO_PLAYER_HIT
                    ? GameState.TWO_PLAYER_BALL_MOVING
                    : GameState.SANDBOX_BALL_MOVING;
              },
            });
          },
        });
      },
    });
  }
});

window.addEventListener("keydown", (e) => {
  if (
    currentState === GameState.TWO_PLAYER_IDLE ||
    currentState === GameState.SANDBOX_IDLE
  ) {
    if (e.code === "KeyA") {
      indexes.angle += 1;
    } else if (e.code === "KeyD") {
      indexes.angle -= 1;
    }
  }
  // if (
  //   e.code === "Enter" &&
  //   (currentState === GameState.TWO_PLAYER_BALL_MOVING ||
  //     currentState === GameState.SANDBOX_BALL_MOVING)
  // ) {
  //   reset2PGameState();
  // }
});

/**
 * GUI Setup
 */
const gui = new GUI();
if (currentState === GameState.SANDBOX_IDLE) {
  gui.add(ballHit, "resetWhite");
  gui.add(indexes, "angle").min(0).max(360).step(1);
  gui.add(indexes, "force").min(10).max(1000).step(10);
}

scene.add(floor);

/**
 * UI Buttons
 */
const overlay = document.getElementById("overlay");
const updateOverlayVisibility = () => {
  if (currentState === GameState.START_SCREEN) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
};

const playButton = document.getElementById("playButton");
const sandboxButton = document.getElementById("sandboxButton");

playButton.addEventListener("click", () => {
  currentState = GameState.TWO_PLAYER_IDLE;
  updateOverlayVisibility();
});

sandboxButton.addEventListener("click", () => {
  currentState = GameState.SANDBOX_IDLE;
  updateOverlayVisibility();
});

/**
 * Functions
 */
const updateCuePosition = () => {
  const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);
  const distanceFromBall = 1.05;
  const whiteBallPosition = poolBalls.whiteBall.body.position;
  const cueX =
    whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
  const cueZ =
    whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;
  cueModel.position.set(cueX, cueModel.position.y, cueZ);
  cueModel.lookAt(
    new THREE.Vector3(
      whiteBallPosition.x,
      whiteBallPosition.y * 0.99,
      whiteBallPosition.z
    )
  );
};

let currentPlayer = "p1";
let players = {};
players.p1 = [];
players.p2 = [];
console.log(players);

const reset2PGameState = () => {
  const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);
  const distanceFromBall = 1.05;
  const whiteBallPosition = poolBalls.whiteBall.body.position;
  const cueX =
    whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
  const cueZ =
    whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;

  gsap.to(cueModel.position, {
    duration: 0.5,
    x: cueX,
    y: 0.72,
    z: cueZ,
    onComplete: () => {
      currentState = GameState.TWO_PLAYER_IDLE;
      currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
    },
  });
};

const resetSBGameState = () => {
  const angleInRadians = THREE.MathUtils.degToRad(indexes.angle);
  const distanceFromBall = 1.05;
  const whiteBallPosition = poolBalls.whiteBall.body.position;
  const cueX =
    whiteBallPosition.x - Math.cos(angleInRadians) * distanceFromBall;
  const cueZ =
    whiteBallPosition.z - Math.sin(angleInRadians) * distanceFromBall;

  gsap.to(cueModel.position, {
    duration: 0.5,
    x: cueX,
    y: 0.72,
    z: cueZ,
    onComplete: () => {
      currentState = GameState.TWO_PLAYER_IDLE;
    },
  });
};

const checkScore = () => {
  if (
    currentState === GameState.TWO_PLAYER_HIT ||
    (currentState === GameState.TWO_PLAYER_BALL_MOVING &&
      currentScore === ScoreState.NO_SCORE)
  ) {
  }
};

const isWhiteBallMoving = () => {
  const velocity = poolBalls.whiteBall.body.velocity;
  return velocity.length() > 0.005;
};

let hasReset = false;

/**
 * Animation Loop
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);

  for (const ball of objectsToUpdate) {
    ball.mesh.position.copy(ball.body.position);
    ball.mesh.quaternion.copy(ball.body.quaternion);
  }

  if (
    currentState === GameState.TWO_PLAYER_IDLE ||
    currentState === GameState.SANDBOX_IDLE
  ) {
    updateCuePosition();
  }

  if (
    currentState === GameState.TWO_PLAYER_BALL_MOVING &&
    !isWhiteBallMoving() &&
    !hasReset
  ) {
    reset2PGameState();
    hasReset = true;
  }

  if (currentState !== GameState.TWO_PLAYER_BALL_MOVING) {
    hasReset = false;
  }

  for (const [key, ball] of Object.entries(StripedPoolBalls)) {
    if (ball.mesh.position.y < 0.5) {
      scene.remove(ball.mesh);
      world.remove(ball.body);
      if (!players[currentPlayer].includes(key)) {
        players[currentPlayer].push(key);
      }
      delete StripedPoolBalls[key];
      const index = objectsToUpdate.indexOf(ball);
      if (index !== -1) {
        objectsToUpdate.splice(index, 1);

        console.log(players);
      }
    }
  }

  for (const [key, ball] of Object.entries(FilledPoolBalls)) {
    if (ball.mesh.position.y < 0.5) {
      scene.remove(ball.mesh);
      world.remove(ball.body);
      if (!players[currentPlayer].includes(key)) {
        players[currentPlayer].push(key);
      }
      delete StripedPoolBalls[key];
      const index = objectsToUpdate.indexOf(ball);
      if (index !== -1) {
        objectsToUpdate.splice(index, 1);

        console.log(players);
      }
    }
  }

  checkScore();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
