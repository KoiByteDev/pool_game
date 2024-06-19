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
    whiteBall:     createPoolBall(new THREE.Vector3(0.3, 1, 0)),
    yellowFilled:  createPoolBall(new THREE.Vector3(-0.55, 1, 0), "#ffde0d"),
    orangeFilled:  createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, 0.0225), "#e36801"),
    redStriped:    createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, -0.0225)),
    blueStriped:   createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0.0225 * 2)),
    eightBall:     createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0), "#000000"),
    blueFilled:    createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, -0.0225 * 2), "#0050ab"),
    purpleFilled:  createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225 * 3), "#67009d"),
    greenStriped:  createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225)),
    maroonFilled:  createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225), "#5b0000"),
    yellowStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225 * 3)),
    purpleStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 4)),
    redFilled:     createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 2), "#ae0000"),
    orangeStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0)),
    maroonStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 2)),
    greenFilled:   createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 4), "#007200"),
};

export { poolBalls, objectsToUpdate };