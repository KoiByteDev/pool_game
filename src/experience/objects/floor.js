import * as THREE from "three";
import { floorTextures } from "../utils/assetLoader";
import { textureLoader } from "../utils/assetLoader";
import { scene } from "../experience";

floorTextures.floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorTextures.floorColorTexture.repeat.set(2, 2);
floorTextures.floorARMTexture.repeat.set(2, 2);
floorTextures.floorNormalTexture.repeat.set(2, 2);
floorTextures.floorDispTexture.repeat.set(2, 2);

floorTextures.floorColorTexture.wrapS = THREE.RepeatWrapping;
floorTextures.floorARMTexture.wrapS = THREE.RepeatWrapping;
floorTextures.floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorTextures.floorDispTexture.wrapS = THREE.RepeatWrapping;

floorTextures.floorColorTexture.wrapT = THREE.RepeatWrapping;
floorTextures.floorARMTexture.wrapT = THREE.RepeatWrapping;
floorTextures.floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorTextures.floorDispTexture.wrapT = THREE.RepeatWrapping;

floorTextures.floorColorTexture.anisotropy = 8;
floorTextures.floorARMTexture.anisotropy = 8;
floorTextures.floorNormalTexture.anisotropy = 8;
floorTextures.floorDispTexture.anisotropy = 8;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorTextures.floorAlphaTexture,
    transparent: true,
    map: floorTextures.floorColorTexture,
    aoMap: floorTextures.floorARMTexture,
    roughnessMap: floorTextures.floorARMTexture,
    metalnessMap: floorTextures.floorARMTexture,
    displacementMap: floorTextures.floorDispTexture,
    displacementScale: 0.025,
    displacementBias: -0.025,
  }),
);
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2;
floor.rotation.z = Math.PI / 2;
scene.add(floor)
export { floor }
