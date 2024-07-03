import * as THREE from "three";
import GUI from "lil-gui";
import CANNON from "cannon";
import { gltfLoader, textureLoader } from "./experience/utils/assetLoader.js";
import { scene, camera, controls, renderer } from "./experience/experience.js";
import { wallMaterial, tableMaterial, world } from "./experience/world.js";
import {
  poolBalls,
  objectsToUpdate,
  StripedPoolBalls,
  FilledPoolBalls,
} from "./experience/objects/poolBalls.js";
import { createPoolTable } from "./experience/objects/poolTable.js";
import { cueModel } from "./experience/objects/poolCue.js";
import { gsap } from "gsap/gsap-core";
import { GameState, ScoreState } from "./experience/states.js";
import { floor } from './experience/objects/floor.js'

console.log(floor.position)

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

let currentState = GameState.START_SCREEN;
let currentScore = GameState.NO_SCORE;

/**
 * Event Listeners
 */
let oscillating = false;
let oscillationInterval;

window.addEventListener("keydown", (e) => {
  if (
    (currentState === GameState.TWO_PLAYER_IDLE ||
      currentState === GameState.SANDBOX_IDLE) &&
    e.code === "Space" && !oscillating
  ) {
    oscillating = true;
    let direction = 1;

    oscillationInterval = setInterval(() => {
      indexes.force += direction * 10;
      if (indexes.force >= 1000 || indexes.force <= 0) {
        direction *= -1;
      }
      console.log(indexes.force);
    }, 100);
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space" && oscillating) {
    clearInterval(oscillationInterval);
    oscillating = false;

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

/**
 * UI Buttons
 */
const overlay = document.getElementById("overlay");
const title = document.getElementById("title");
const sandboxButton = document.getElementById("sandboxButton");
const playButton = document.getElementById("playButton");

const updateOverlayVisibility = () => {
  if (currentState === GameState.START_SCREEN) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
};

const handleButtonClick = (state) => {
  title.classList.add("fade-out");
  title.classList.add("slide-up")
  sandboxButton.classList.add("slide-out-left");
  playButton.classList.add("slide-out-right");

  setTimeout(() => {
    currentState = state;
    updateOverlayVisibility();
  }, 1000);

  setTimeout(() => {
    showPlayerTurnMessage(`player 1's turn`);
  }, 1250);
};

playButton.addEventListener("click", () => {
  handleButtonClick(GameState.TWO_PLAYER_IDLE);
});

sandboxButton.addEventListener("click", () => {
  handleButtonClick(GameState.SANDBOX_IDLE);
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
players.p1 = { balls: [], group: null };
players.p2 = { balls: [], group: null };
console.log(players);

const reset2PGameState = (scored) => {
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
      if (!scored) {
        currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
      }
      showPlayerTurnMessage(`player ${currentPlayer === "p1" ? "1" : "2"}'s turn`);
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
  let scored = false;
  let scoredBallType = null;

  for (const [key, ball] of Object.entries(StripedPoolBalls)) {
    if (ball.mesh.position.y < 0.5) {
      scene.remove(ball.mesh);
      world.remove(ball.body);
      if (!players[currentPlayer].balls.includes(key)) {
        players[currentPlayer].balls.push(key);
      }
      delete StripedPoolBalls[key];
      const index = objectsToUpdate.indexOf(ball);
      if (index !== -1) {
        objectsToUpdate.splice(index, 1);
      }
      scored = true;
      scoredBallType = "striped";
    }
  }

  for (const [key, ball] of Object.entries(FilledPoolBalls)) {
    if (ball.mesh.position.y < 0.5) {
      scene.remove(ball.mesh);
      world.remove(ball.body);
      if (!players[currentPlayer].balls.includes(key)) {
        players[currentPlayer].balls.push(key);
      }
      delete FilledPoolBalls[key];
      const index = objectsToUpdate.indexOf(ball);
      if (index !== -1) {
        objectsToUpdate.splice(index, 1);
      }
      scored = true;
      scoredBallType = "filled";
    }
  }

  if (scored && players[currentPlayer].group === null) {
    players[currentPlayer].group = scoredBallType;
    const otherPlayer = currentPlayer === "p1" ? "p2" : "p1";
    players[otherPlayer].group = scoredBallType === "striped" ? "filled" : "striped";
  }

  if (
    currentState === GameState.TWO_PLAYER_BALL_MOVING &&
    !isWhiteBallMoving()
  ) {
    reset2PGameState(scored);
  }
};

const isWhiteBallMoving = () => {
  const velocity = poolBalls.whiteBall.body.velocity;
  return velocity.length() > 0.005;
};

const showPlayerTurnMessage = (message) => {
  const playerTurnMessage = document.getElementById("player-turn-message");
  playerTurnMessage.innerText = message;

  playerTurnMessage.classList.remove("slide-out");
  playerTurnMessage.classList.add("slide-in");

  setTimeout(() => {
    playerTurnMessage.classList.remove("slide-in");
    playerTurnMessage.classList.add("slide-out");
  }, 1500);

  console.log(playerTurnMessage)
}

/**
 * Animation Loop
 */

let hasReset = false;

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
    checkScore();
    hasReset = true;
  }

  if (currentState !== GameState.TWO_PLAYER_BALL_MOVING) {
    hasReset = false;
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
