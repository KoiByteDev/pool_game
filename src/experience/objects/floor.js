import * as THREE from "three";
import { textureLoader } from "../utils/utils";
import { scene } from "../experience";

const floorAlphaTexture = textureLoader.load("./textures/floor/alpha.jpg");
const floorARMTexture = textureLoader.load("./textures/floor/wfd/wfd_arm.jpg");
const floorColorTexture = textureLoader.load("./textures/floor/wfd/wfd_diff.jpg");
const floorDispTexture = textureLoader.load("./textures/floor/wfd/wfd_disp.jpg");
const floorNormalTexture = textureLoader.load("./textures/floor/wfd/wfd_nor.jpg");

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(2, 2);
floorARMTexture.repeat.set(2, 2);
floorNormalTexture.repeat.set(2, 2);
floorDispTexture.repeat.set(2, 2);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDispTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDispTexture.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    displacementMap: floorDispTexture,
    displacementScale: 0.025,
    displacementBias: -0.025,
  }),
);
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2;
floor.rotation.z = Math.PI / 2;
export { floor };
