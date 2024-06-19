import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import CANNON from 'cannon';

/**
 * Base
 */
// Debug
const gui = new GUI();
const ballHit = {};

const hit = () => {
    const whiteBall = objectsToUpdate.find(
        (object) => object.mesh.name === 'white_ball'
    );

    whiteBall.body.applyLocalForce(
        new CANNON.Vec3(0 - 10, 0, 0),
        whiteBall.body.position
    );
};

ballHit.hit = hit;

gui.add(ballHit, 'hit');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Experience
const experience = {
    scene: scene,
    cannonWorld: new CANNON.World(),
};

experience.cannonWorld.broadphase = new CANNON.SAPBroadphase(experience.cannonWorld);
experience.cannonWorld.gravity.set(0, -9.82, 0);

const defaultMaterial = new CANNON.Material('plastic');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.5,
        restitution: 0,
    }
);
experience.cannonWorld.addContactMaterial(defaultContactMaterial);
experience.cannonWorld.defaultContactMaterial = defaultContactMaterial;

const objectsToUpdate = [];

const addPoolBall = (mesh, position) => {
    const shape = new CANNON.Sphere(mesh.geometry.parameters.radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
    });
    body.position.copy(position);
    experience.cannonWorld.addBody(body);

    objectsToUpdate.push({
        mesh,
        body,
    });
};

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

    addPoolBall(mesh, position);
};

/**
 * World
 */
const world = {
    whiteBall: createPoolBall(new THREE.Vector3(0.55, 1, 0)),
    yellowFilled: createPoolBall(new THREE.Vector3(-0.3, 2, 0), '#ffde0d'),
    orangeFilled: createPoolBall(new THREE.Vector3(-0.35, 2, 0.03), '#e36801'),
    redStriped: createPoolBall(new THREE.Vector3(-0.35, 2, -0.03)),
    blueStriped: createPoolBall(new THREE.Vector3(-0.4, 2, 0.06)),
    eightBall: createPoolBall(new THREE.Vector3(-0.4, 2, 0), '#000000'),
    blueFilled: createPoolBall(new THREE.Vector3(-0.4, 2, -0.06), '#0050ab'),
    purpleFilled: createPoolBall(new THREE.Vector3(-0.45, 2, 0.09), '#67009d'),
    greenStriped: createPoolBall(new THREE.Vector3(-0.45, 2, 0.03)),
    maroonFilled: createPoolBall(new THREE.Vector3(-0.45, 2, -0.03), '#5b0000'),
    yellowStriped: createPoolBall(new THREE.Vector3(-0.45, 2, -0.09)),
    purpleStriped: createPoolBall(new THREE.Vector3(-0.5, 2, 0.12)),
    redFilled: createPoolBall(new THREE.Vector3(-0.5, 2, 0.06), '#ae0000'),
    orangeStriped: createPoolBall(new THREE.Vector3(-0.5, 2, 0)),
    maroonStriped: createPoolBall(new THREE.Vector3(-0.5, 2, -0.06)),
    greenFilled: createPoolBall(new THREE.Vector3(-0.5, 2, -0.12), '#007200'),
};

/**
 * Environment
 */
const environment = {
    setLight: () => {
        const light = new THREE.DirectionalLight('#ffffff', 4);
        light.castShadow = true;
        light.shadow.camera.far = 15;
        light.shadow.mapSize.set(1024, 1024);
        light.shadow.normalBias = 0.05;
        light.position.set(3, 3, -2.25);
        scene.add(light);
    },
    setAmbientLight: () => {
        const ambientLight = new THREE.AmbientLight('#efc070', 0.05);
        scene.add(ambientLight);
    },
};

environment.setLight();
environment.setAmbientLight();

/**
 * Floor
 */
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.addShape(floorShape);
floorBody.position.y = 0.65;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
experience.cannonWorld.addBody(floorBody);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
    experience.cannonWorld.step(1 / 60, deltaTime, 3);

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
