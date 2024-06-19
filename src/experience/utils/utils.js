import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Loaders
const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

export { gltfLoader, textureLoader };