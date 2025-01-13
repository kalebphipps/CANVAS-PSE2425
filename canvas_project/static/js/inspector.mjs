import * as THREE from "three";
import { Object3D } from "three";

/**
 * Inspector class
 */
export class Inspector {
  #picker;
  #undoRedoHandler;
  /** @type {THREE.Object3D[]} */
  #objects3D = [];
  /** @type {InspectorSelection} */
  #inspectorSelection;

  /**
   *
   * @param {Picker} picker
   * @param {UndoRedoHandler} undoRedoHandler
   */
  constructor(picker, undoRedoHandler) {
    this.#picker = picker;
    this.#undoRedoHandler = undoRedoHandler;
  }
}
