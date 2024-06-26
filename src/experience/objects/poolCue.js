import * as THREE from "three";
import { scene } from "../experience";
import { wallMaterial, world } from "../world";
import CANNON from "cannon";
import { objectsToUpdate } from "../world";

const createPoolCue = (gltfLoader, position) => {
  return new Promise((resolve) => {
    gltfLoader.load("./models/Cue/poolCue.glb", (gltf) => {
      const cueModel = gltf.scene;
      cueModel.position.y = 0.70;
      cueModel.position.x = 0.75;
      cueModel.position.z = -0.5;
      cueModel.rotation.y = Math.PI / 4;
      cueModel.castShadow = true;
      scene.add(cueModel);

      resolve({ cueModel });
    });
  });
};

export { createPoolCue };
