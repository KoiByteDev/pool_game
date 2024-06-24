import * as THREE from "three";
import { scene } from "../experience";
import { wallMaterial, world } from "../world";
import CANNON from "cannon";
import { objectsToUpdate } from "../world";

const createPoolCue = (gltfLoader) => {
  return new Promise((resolve) => {
    gltfLoader.load("./models/Cue/poolCue.glb", (gltf) => {
      const cueModel = gltf.scene;
      cueModel.position.y = 0.72;
      cueModel.castShadow = true;
      scene.add(cueModel);

      const tipGeometry = new THREE.SphereGeometry(0.025, 20, 20);
      const tipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const mesh = new THREE.Mesh(tipGeometry, tipMaterial);
      mesh.position.copy(
        new THREE.Vector3(
          cueModel.position.x,
          cueModel.position.y,
          cueModel.position.z
        )
      );
      scene.add(mesh);

      const tipShape = new CANNON.Sphere(0.025, 20, 20);
      const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: tipShape,
        material: wallMaterial,
      });
      body.position.copy(
        new THREE.Vector3(
          cueModel.position.x,
          cueModel.position.y,
          cueModel.position.z
        )
      )
      world.addBody(body);
      console.log(body)

      const object = { mesh, body }
      objectsToUpdate.push(object)
      resolve({ cueModel, mesh, body });
    });
  });
};

export { createPoolCue };
