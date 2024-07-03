import * as THREE from 'three'
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from 'gsap';
import { overlayMaterial } from './overlay';

const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
    console.log('loaded')
  },
  () => {
    console.log('loading')
  }
)

// Loaders
const gltfLoader = new GLTFLoader(loadingManager);
const textureLoader = new TextureLoader(loadingManager);

const ballTextures = {}
ballTextures.yellowFilled = textureLoader.load('./textures/balls/yellowFilled.jpg')
ballTextures.yellowFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.orangeFilled = textureLoader.load('./textures/balls/orangeFilled.jpg')
ballTextures.orangeFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.redStriped = textureLoader.load('./textures/balls/redStriped.jpg')
ballTextures.redStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.blueStriped = textureLoader.load('./textures/balls/blueStriped.jpg')
ballTextures.blueStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.eightBall = textureLoader.load('./textures/balls/eightBall.jpg')
ballTextures.eightBall.colorSpace = THREE.SRGBColorSpace;

ballTextures.blueFilled = textureLoader.load('./textures/balls/blueFilled.jpg')
ballTextures.blueFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.purpleFilled = textureLoader.load('./textures/balls/purpleFilled.jpg')
ballTextures.purpleFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.greenStriped = textureLoader.load('./textures/balls/greenStriped.jpg')
ballTextures.greenStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.maroonFilled = textureLoader.load('./textures/balls/maroonFilled.jpg')
ballTextures.maroonFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.yellowStriped = textureLoader.load('./textures/balls/yellowStriped.jpg')
ballTextures.yellowStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.purpleStriped = textureLoader.load('./textures/balls/purpleStriped.jpg')
ballTextures.purpleStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.redFilled = textureLoader.load('./textures/balls/redFilled.jpg')
ballTextures.redFilled.colorSpace = THREE.SRGBColorSpace;

ballTextures.orangeStriped = textureLoader.load('./textures/balls/orangeStriped.jpg')
ballTextures.orangeStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.maroonStriped = textureLoader.load('./textures/balls/maroonStriped.jpg')
ballTextures.maroonStriped.colorSpace = THREE.SRGBColorSpace;

ballTextures.greenFilled = textureLoader.load('./textures/balls/greenFilled.jpg')
ballTextures.greenFilled.colorSpace = THREE.SRGBColorSpace;

const floorTextures = {}
floorTextures.floorAlphaTexture = textureLoader.load("./textures/floor/alpha.jpg");
floorTextures.floorARMTexture = textureLoader.load("./textures/floor/wfd/wfd_arm.jpg");
floorTextures.floorColorTexture = textureLoader.load("./textures/floor/wfd/wfd_diff.jpg");
floorTextures.floorDispTexture = textureLoader.load("./textures/floor/wfd/wfd_disp.jpg");
floorTextures.floorNormalTexture = textureLoader.load("./textures/floor/wfd/wfd_nor.jpg");

export { gltfLoader, textureLoader, ballTextures, floorTextures };