import * as THREE from "three";

import { ViewHelper } from "compass";
import { OrbitControls } from "orbitControls";
import { TransformControls } from "transformControls";

import { UndoRedoHandler } from "undoRedoHandler";
import { SaveAndLoadHandler } from "saveAndLoadHandler";
import { Navbar } from "navbar";
import { Overview } from "overview";
import { ModeSelector } from "modeSelector";
import { Picker } from "picker";
import { ProjectSettingManager } from "projectSettingManager";
import { QuickSelector } from "quickSelector";
import { JobInterface } from "jobInterface";
import { Inspector } from "inspector";

import { Heliostat, Receiver, Lightsource, Terrain } from "objects";

let editorInstance = null;
export class Editor {
  #undoRedoHandler;
  #saveAndLoadHandler;
  #navbar;
  #picker;
  #overview;
  #modeSelector;
  #projectSettingManager;
  #quickSelector;
  #jobInterface;
  #inspector;

  #projectId;
  #canvas;
  #transformControls;
  #controls;
  #compass;
  #selectionBox;
  #directionalLight;
  #hemisphereLight;
  #skybox;
  #skyboxLoader;
  #renderer;
  #camera;
  #scene;
  #selectableGroup;
  #terrain;

  constructor(projectId) {
    // singleton
    if (editorInstance) return editorInstance;
    editorInstance = this;

    this.#projectId = projectId;

    // initiate needed classes
    this.#undoRedoHandler = new UndoRedoHandler();
    this.#saveAndLoadHandler = new SaveAndLoadHandler(projectId);
    this.#navbar = new Navbar();
    this.#picker = new Picker();
    this.#overview = new Overview(this.#picker);
    this.#modeSelector = new ModeSelector();
    this.#projectSettingManager = new ProjectSettingManager();
    this.#quickSelector = new QuickSelector();
    this.#jobInterface = new JobInterface();
    this.#inspector = new Inspector(this.#picker);

    // initate ThreeJs scene
    this.#setUpScene();
    this.#loadProject();

    window.addEventListener("resize", () => this.onWindowResize());

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    this.#renderer.clear();
    this.#renderer.render(this.#scene, this.#camera);
    this.#compass.render(this.#renderer);
  }

  updateAspectRatio() {
    this.#camera.aspect = this.#canvas.offsetWidth / this.#canvas.offsetHeight;
    this.#camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.updateAspectRatio();
    this.#renderer.setSize(this.#canvas.offsetWidth, this.#canvas.offsetHeight);
    this.render();
  }

  #setUpScene() {}

  async #loadProject() {}
}
