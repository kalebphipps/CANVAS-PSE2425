import * as THREE from "three";

import { Menu } from "menu";
import { ViewHelper } from "compass";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let editorInstance = null;

export class Editor {
    constructor() {
        // singleton
        if (editorInstance) return editorInstance;
        editorInstance = this;

        this.menu = new Menu();
        this.canvas = document.getElementById("canvas");

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 10);

        this.renderer = new THREE.WebGLRenderer();
        // since we render multiple times (scene and compass), we need to clear the renderer manually
        this.renderer.autoClear = false;
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.canvas.appendChild(this.renderer.domElement);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.gridHelper = new THREE.GridHelper(200, 50);
        this.scene.add(this.gridHelper);

        this.compass = new ViewHelper(this.camera, this.renderer.domElement);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.compass.render(this.renderer);
    };
}
