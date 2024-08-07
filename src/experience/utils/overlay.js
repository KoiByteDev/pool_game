import * as THREE from 'three'
import { scene } from "../experience";

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
export const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
  uniforms: {
    uAlpha: { value: 1 }
  },
  vertexShader: `
    void main()
    {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uAlpha;

    void main()
    {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
  `
})

export const plane = new THREE.Mesh(overlayGeometry, overlayMaterial);
plane.renderOrder = 1;
scene.add(plane)