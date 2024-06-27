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

/**
 * PoolBalls
 */
const poolBalls = {
    whiteBall: createPoolBall(new THREE.Vector3(0.3, 1, 0), null),
    yellowFilled: createPoolBall(new THREE.Vector3(-0.55, 1, 0), ballTextures.yellowFilled),
    orangeFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, 0.0225), ballTextures.orangeFilled), 
    redStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75), 1, -0.0225), ballTextures.redStriped), 
    blueStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0.0225 * 2), ballTextures.blueStriped), 
    eightBall: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, 0), ballTextures.eightBall), 
    blueFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 2), 1, -0.0225 * 2), ballTextures.blueFilled), 
    purpleFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225 * 3), ballTextures.purpleFilled), 
    greenStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, 0.0225), ballTextures.greenStriped), // Use texture instead of
    maroonFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225), ballTextures.maroonFilled), 
    yellowStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 3), 1, -0.0225 * 3), ballTextures.yellowStriped), 
    purpleStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 4), ballTextures.purpleStriped), 
    redFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0.0225 * 2), ballTextures.redFilled), 
    orangeStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, 0), ballTextures.orangeStriped), 
    maroonStriped: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 2), ballTextures.maroonStriped), 
    greenFilled: createPoolBall(new THREE.Vector3(-0.55 - (0.0225 * 1.75 * 4), 1, -0.0225 * 4), ballTextures.greenFilled), 
  };

export { poolBalls, objectsToUpdate };