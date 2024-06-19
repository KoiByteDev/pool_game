import * as THREE from 'three';
import GUI from 'lil-gui';
import CANNON from 'cannon';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene, camera, controls, renderer, sizes } from './experience/experience.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
const ballHit = {};

const hit = () => {
    poolBalls.whiteBall.body.applyLocalForce(
        new CANNON.Vec3(0 - 10, 0, 0),
        poolBalls.whiteBall.body.position
    );
};

ballHit.hit = hit;

gui.add(ballHit, 'hit');

// Loaders
const gltfLoader = new GLTFLoader();

// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.82, 0);

// Materials
const ballMaterial = new CANNON.Material('ballMaterial');
const tableMaterial = new CANNON.Material('tableMaterial');

const ballTableContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    tableMaterial,
    {
        friction: 0.2,
        restitution: 0.15,
    }
);
world.addContactMaterial(ballTableContactMaterial);

const ballBallContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,
    ballMaterial,
    {
        friction: 0.15,
        restitution: 0.8,
    }
);
world.addContactMaterial(ballBallContactMaterial);

const objectsToUpdate = [];

/**
 * Pool Ball
 */
const createPoolBall = (position, color) => {
    const geometry = new THREE.SphereGeometry(0.0235, 20, 20);
    const material = new THREE.MeshStandardMaterial({
        color: color || '#ffffff',
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new CANNON.Sphere(mesh.geometry.parameters.radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: ballMaterial,
    });
    body.position.copy(position);
    world.addBody(body);

    const object = { mesh, body }
    objectsToUpdate.push(object);
    return object
};

/**
 * PoolBalls
 */
const poolBalls = {
    whiteBall: createPoolBall(new THREE.Vector3(0.55, 1, 0)),
    yellowFilled: createPoolBall(new THREE.Vector3(-0.3, 1, 0), "#ffde0d"),
    orangeFilled: createPoolBall(new THREE.Vector3(-0.35, 1, 0.03), "#e36801"),
    redStriped: createPoolBall(new THREE.Vector3(-0.35, 1, -0.03)),
    blueStriped: createPoolBall(new THREE.Vector3(-0.4, 1, 0.06)),
    eightBall: createPoolBall(new THREE.Vector3(-0.4, 1, 0), "#000000"),
    blueFilled: createPoolBall(new THREE.Vector3(-0.4, 1, -0.06), "#0050ab"),
    purpleFilled: createPoolBall(new THREE.Vector3(-0.45, 1, 0.09), "#67009d"),
    greenStriped: createPoolBall(new THREE.Vector3(-0.45, 1, 0.03)),
    maroonFilled: createPoolBall(new THREE.Vector3(-0.45, 1, -0.03), "#5b0000"),
    yellowStriped: createPoolBall(new THREE.Vector3(-0.45, 1, -0.09)),
    purpleStriped: createPoolBall(new THREE.Vector3(-0.5, 1, 0.12)),
    redFilled: createPoolBall(new THREE.Vector3(-0.5, 1, 0.06), "#ae0000"),
    orangeStriped: createPoolBall(new THREE.Vector3(-0.5, 1, 0)),
    maroonStriped: createPoolBall(new THREE.Vector3(-0.5, 1, -0.06)),
    greenFilled: createPoolBall(new THREE.Vector3(-0.5, 1, -0.12), "#007200"),
};

/**
 * Pool Table
 */
gltfLoader.load("./models/Table/BilliardTable.glb", (gltf) => {
    console.log(gltf.scene.children);
    const children = [...gltf.scene.children];
    for (const child of children) {
        child.position.y = 0.65;
        child.position.x = 0;
        child.position.z = 0;
        child.receiveShadow = true;
        scene.add(child);
    }

    const tableShape = new CANNON.Box(new CANNON.Vec3(1.085, 0.1, 0.55));
    const tableBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0.55, 0),
        shape: tableShape,
        material: tableMaterial,
    });
    world.addBody(tableBody);

    // Add walls
    const wallThickness = 0.05;
    const wallHeight = 0.1;
    const wallLength = 1.085;
    const wallDepth = 0.55;

    // Long walls
    const longWallShape = new CANNON.Box(new CANNON.Vec3(wallLength, wallHeight, wallThickness));
    const wall1 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0.65 + wallHeight, wallDepth + wallThickness),
        shape: longWallShape,
        material: tableMaterial,
    });
    const wall2 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0.65 + wallHeight, -wallDepth - wallThickness),
        shape: longWallShape,
        material: tableMaterial,
    });

    // Short walls
    const shortWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness, wallHeight, wallDepth));
    const wall3 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(wallLength + wallThickness, 0.65 + wallHeight, 0),
        shape: shortWallShape,
        material: tableMaterial,
    });
    const wall4 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(-wallLength - wallThickness, 0.65 + wallHeight, 0),
        shape: shortWallShape,
        material: tableMaterial,
    });

    // Add walls to world
    world.addBody(wall1);
    world.addBody(wall2);
    world.addBody(wall3);
    world.addBody(wall4);
});

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
