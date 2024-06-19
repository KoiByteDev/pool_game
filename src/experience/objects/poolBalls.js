import * as THREE from 'three';
import { scene } from '../experience';
import { ballMaterial, world } from '../world';
import CANNON from 'cannon';

const objectsToUpdate = [];

/**
 * Pool Ball
 */
const createPoolBall = (position, color) => {
    const geometry = new THREE.SphereGeometry(0.0225, 20, 20);
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
        mass: 2,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: ballMaterial,
    });
    body.position.copy(position);
    body.linearDamping = 0.3;
    body.angularDamping = 0.4;
    world.addBody(body);

    const object = { mesh, body }
    objectsToUpdate.push(object);
    return object
};

/**
 * PoolBalls
 */
const poolBalls = {
    whiteBall: createPoolBall(new THREE.Vector3(0.3, 1, 0)),
    yellowFilled: createPoolBall(new THREE.Vector3(-0.55, 1, 0), "#ffde0d"),
    orangeFilled: createPoolBall(new THREE.Vector3(-0.6, 1, 0.0275), "#e36801"),
    redStriped: createPoolBall(new THREE.Vector3(-0.6, 1, -0.0275)),
    blueStriped: createPoolBall(new THREE.Vector3(-0.65, 1, 0.06)),
    eightBall: createPoolBall(new THREE.Vector3(-0.65, 1, 0), "#000000"),
    blueFilled: createPoolBall(new THREE.Vector3(-0.65, 1, -0.06), "#0050ab"),
    purpleFilled: createPoolBall(new THREE.Vector3(-0.7, 1, 0.09), "#67009d"),
    greenStriped: createPoolBall(new THREE.Vector3(-0.7, 1, 0.03)),
    maroonFilled: createPoolBall(new THREE.Vector3(-0.7, 1, -0.03), "#5b0000"),
    yellowStriped: createPoolBall(new THREE.Vector3(-0.7, 1, -0.09)),
    purpleStriped: createPoolBall(new THREE.Vector3(-0.75, 1, 0.12)),
    redFilled: createPoolBall(new THREE.Vector3(-0.75, 1, 0.06), "#ae0000"),
    orangeStriped: createPoolBall(new THREE.Vector3(-0.75, 1, 0)),
    maroonStriped: createPoolBall(new THREE.Vector3(-0.75, 1, -0.06)),
    greenFilled: createPoolBall(new THREE.Vector3(-0.75, 1, -0.12), "#007200"),
};

export { poolBalls, objectsToUpdate };