import * as THREE from "three";

import { ViewHelper } from "compass";
import { OrbitControls } from "orbitControls";
import { TransformControls } from "transformControls";
import { UndoRedoHandler } from "undoRedoHandler";
import { SaveAndLoadHandler } from "saveAndLoadHandler";
import { Heliostat, Receiver, Lightsource, Terrain } from "objects";
import { Object3D } from "three";
import { Navbar } from "navbar";
import { BoxHelper } from "three";

let editorInstance = null;

export class Editor {
  /**
   * Gets the current editor instance or creates the first on
   * @param {Number} projectId Is the id of the project
   * @returns the editor instance or the newly created one
   */
  constructor(projectId) {
    // singleton
    if (editorInstance) return editorInstance;
    editorInstance = this;

    this.projectId = projectId;
    this.undoRedoHandler = new UndoRedoHandler();
    this.saveAndLoadHandler = new SaveAndLoadHandler(projectId);
    this.navbar = new Navbar();

    this.#setUpScene();

    this.#loadProject();

    window.addEventListener("resize", () => this.onWindowResize());

    this.animate();
  }

  /**
   * Adds the project to the scene and automatically save it to the backend
   * @param {Object3D} object Is the object you want to add
   */
  addObject(object) {
    // TODO: determine type and save object in db
    this.scene.add(object);
  }

  /**
   * Deletes the project from the scene and also deletes it from the backend
   * @param {Object3D} object Is the object you want to delete
   */
  deleteObject(object) {
    // TODO: determine type and delete object from db
    this.scene.remove(object);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.compass.render(this.renderer);
  }

  updateAspectRatio() {
    this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.updateAspectRatio();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.render();
  }

  #setUpScene() {
    this.canvas = document.getElementById("canvas");

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      2000
    );
    this.camera.position.set(-7.5, 2.5, 0.75);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // since we render multiple times (scene and compass), we need to clear the renderer manually
    this.renderer.autoClear = false;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.canvas.appendChild(this.renderer.domElement);

    //set up empty scene
    this.skyboxLoader = new THREE.CubeTextureLoader();
    this.skybox = this.skyboxLoader.load([
      "/static/img/skybox/px.png",
      "/static/img/skybox/nx.png",
      "/static/img/skybox/py.png",
      "/static/img/skybox/ny.png",
      "/static/img/skybox/pz.png",
      "/static/img/skybox/nz.png",
    ]);
    this.scene.background = this.skybox;
    this.scene.fog = new THREE.Fog(0xdde0e0, 100, 2200);

    this.hemisphereLight = new THREE.HemisphereLight();
    this.scene.add(this.HemisphereLight);

    this.terrain = new Terrain(2000);
    this.scene.add(this.terrain);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    this.directionalLight.position.set(200, 100, 200);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.directionalLight.shadow.mapSize.set(16384, 16384);
    this.directionalLight.shadow.radius = 2;
    this.directionalLight.shadow.blurSamples = 10;
    this.directionalLight.shadow.camera.top = 200;
    this.directionalLight.shadow.camera.bottom = -200;
    this.directionalLight.shadow.camera.left = 400;
    this.directionalLight.shadow.camera.right = -400;
    this.directionalLight.shadow.camera.far = 1000;

    // Helpers
    this.compass = new ViewHelper(
      this.camera,
      this.renderer.domElement,
      200,
      "circles"
    );

    this.selectionBox = new BoxHelper();
    this.scene.add(this.selectionBox);

    // controls
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.scene.add(this.transformControls.getHelper());

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = false;
    this.controls.maxDistance = 500;
    this.controls.minDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;

    // disable orbit controls while moving object
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.controls.enabled = !event.value;
    });
  }

  async #loadProject() {
    const projectJson = await this.saveAndLoadHandler.getProjectData();

    //TODO: Go through Json and place objects
  }
}
