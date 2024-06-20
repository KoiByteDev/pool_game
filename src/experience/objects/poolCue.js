import * as THREE from "three";
import { scene } from "../experience";
import { wallMaterial, world } from "../world";
import CANNON from "cannon";

const createPoolCue = (gltfLoader) => {
  return new Promise((resolve) => {
    gltfLoader.load("./models/Cue/poolCue.glb", (gltf) => {
      const cueModel = gltf.scene;
      cueModel.position.y = 0.73;
      cueModel.position.x = 1.5;
      cueModel.rotation.z = Math.PI / 2 + 0.05;
      scene.add(cueModel);

      const tipGeometry = new THREE.SphereGeometry(0.05, 20, 20); // Increased radius
      const tipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red material
      const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);

      scene.add(tipMesh);

      const tipShape = new CANNON.Sphere(0.1, 20, 20); // Adjust if needed
      const tipBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: tipShape,
        material: wallMaterial,
      });

      tipBody.position.copy(tipMesh.position);

      world.addBody(tipBody);

      resolve(cueModel, tipMesh);
    });
  });
};

export { createPoolCue };
