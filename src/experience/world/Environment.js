import * as THREE from 'three'
import Experience from "../experience";

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setLight()
        this.setAmbientLight()
    }

    setLight() {
        this.light = new THREE.DirectionalLight('#ffffff', 4)
        this.light.castShadow = true
        this.light.shadow.camera.far = 15
        this.light.shadow.mapSize.set(1024, 1024)
        this.light.shadow.normalBias = 0.05
        this.light .position.set(3, 3, -2.25)
        this.scene.add(this.light)
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#efc070', 0.05)
        this.scene.add(this.ambientLight)
    }
}