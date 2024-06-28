import * as THREE from 'three';
import { scene } from '../experience';
import { ballMaterial, world } from '../world';
import { ballTextures } from '../utils/utils';
import CANNON from 'cannon';
import { objectsToUpdate } from '../world';

/**
 * Pool Ball
 */
const createPoolBall = (position, texture) => {
    const geometry = new THREE.SphereGeometry(0.0225, 20, 20);
    const material = new THREE.MeshStandardMaterial({
        map: texture
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
    body.linearDamping = 0.4;
    body.angularDamping = 0.6;
    world.addBody(body);

    const object = { mesh, body }
    objectsToUpdate.push(object);
    return object
};

const FilledPoolBalls = {
    yellowFilled: createPoolBall(new THREE.Vector3(-0.55, 1, 0), ballTextures.yellowFilled),
    orangeFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, 0.0225), ballTextures.orangeFilled),
    blueFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, -0.0225 * 2), ballTextures.blueFilled),
    purpleFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225 * 3), ballTextures.purpleFilled),
    maroonFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225), ballTextures.maroonFilled),
    redFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 2), ballTextures.redFilled),
    greenFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 4), ballTextures.greenFilled),
};


const StripedPoolBalls = {
    redStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, -0.0225), ballTextures.redStriped),
    blueStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0.0225 * 2), ballTextures.blueStriped),
    greenStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225), ballTextures.greenStriped),
    yellowStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225 * 3), ballTextures.yellowStriped),
    purpleStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 4), ballTextures.purpleStriped),
    orangeStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0), ballTextures.orangeStriped),
    maroonStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 2), ballTextures.maroonStriped),
};

const poolBalls = {
    whiteBall: createPoolBall(new THREE.Vector3(0.3, 1, 0), null),
    eightBall: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0), ballTextures.eightBall),
    ...FilledPoolBalls,
    ...StripedPoolBalls
};

export { poolBalls, objectsToUpdate };
