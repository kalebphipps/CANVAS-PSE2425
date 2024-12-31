import * as THREE from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Represents a Heliostat 3D model containing all the necassary parameters and functions for that.
 */
export class Heliostat extends Object3D {
  constructor() {
    super();
    this.loader = new GLTFLoader();
    this.mesh;
    this.loader.load("/static/models/heliostat.glb", (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.scale.set(2, 2, 2);
      this.lookAt(0, 0, 0);
      this.rotateY(Math.PI / 2);
      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      this.add(this.mesh);
    });
  }
}

/**
 * Represents a Receiver 3D model containing all the necassary parameters and functions for that.
 */
export class Receiver extends Object3D {
  constructor() {
    super();
    this.loader = new GLTFLoader();
    this.mesh;
    this.loader.load("/static/models/tower.glb", (gltf) => {
      this.mesh = gltf.scene;
      this.add(this.mesh);
      this.mesh.traverse((child) => {
        if (child.type == "Mesh") {
          child.castShadow = true;
        }
      });
    });
  }
}

/**
 * Represents a Lightsource 3D model containing all the necassary parameters and functions for that.
 */
export class Lightsource extends Object3D {
  constructor() {
    super();
  }
}

export class Terrain extends Object3D {
  constructor(size) {
    super();

    this.terrain = new THREE.Mesh(
      new THREE.CircleGeometry(size / 2),
      new THREE.MeshStandardMaterial({
        color: 0x5fd159,
      })
    );
    this.terrain.receiveShadow = true;
    this.terrain.rotateX((3 * Math.PI) / 2);
    this.add(this.terrain);

    // mountains/trees
    this.mountains = new THREE.Group();
    this.add(this.mountains);
    for (let i = 0; i < 100; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(THREE.MathUtils.randFloat(20, 100)),
        new THREE.MeshStandardMaterial({
          color: 0x50ba78,
        })
      );
      sphere.position.set(
        (size / 2) * Math.sin((i / 100) * 2 * Math.PI),
        0,
        (size / 2) * Math.cos((i / 100) * 2 * Math.PI)
      );
      this.mountains.add(sphere);
    }
  }
}
