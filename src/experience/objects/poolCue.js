import { scene } from "../experience";
import { gltfLoader } from "../utils/assetLoader";

let cueModel;

gltfLoader.load("./models/Cue/poolCue.glb", (gltf) => {
  const loadedModel = gltf.scene;
  loadedModel.position.y = 0.7;
  loadedModel.position.x = 0.75;
  loadedModel.position.z = -0.5;
  loadedModel.rotation.y = Math.PI / 4;
  loadedModel.castShadow = true;
  scene.add(loadedModel);
  cueModel = loadedModel
});

export { cueModel };
