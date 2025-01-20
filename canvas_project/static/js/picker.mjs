import * as THREE from "three";

export const Mode = Object.freeze({
    NONE: "none",
    SINGLE: "single",
    RECTANGLE: "rectangle",
    ROTATE: "rotate",
});

export class Picker {
    #camera;
    #transformControls;
    #selectionBox;
    #selectableGroup;
    #selectedObjects;
    #raycaster;
    #mode;

    /**
     * Creates a new Picker object
     * @param {THREE.Camera} camera The camera to be used for raycasting
     * @param {THREE.TransformControls} transformControls The transform controls to be used for selected objects
     * @param {THREE.Box3Helper} selectionBox The selection box to be used for selected objects
     * @param {THREE.Group} selectableGroup The group of objects to be selected
     */
    constructor(camera, transformControls, selectionBox, selectableGroup) {
        this.#camera = camera;
        this.#transformControls = transformControls;
        this.#selectionBox = selectionBox;
        this.#selectableGroup = selectableGroup;
        this.#selectedObjects = [];
        this.#raycaster = new THREE.Raycaster();
        this.#mode = Mode.NONE;

        // TODO: Event listener for click

        // TODO: Event listener for Rectangular selection

    }

    /**
     * Sets the selection mode and updats the tranformControls
     * @param {Mode} mode The selection mode
     */
    setMode(mode) {
        this.#mode = mode;
        if (mode === Mode.NONE) {
            this.#transformControls.detach();
            this.#selectionBox.visible = false;
        }
        else if (mode === Mode.SINGLE || mode === Mode.RECTANGLE) {
            this.#transformControls.setMode("translate");
        }
        else {
            this.#transformControls.setMode("rotate");
        }
    }


    /**
     * Returns the list of selected objects
     * @returns List of selected objects
     */
    getSelectedObjects() {
        return this.#selectedObjects;
    }

    /**
     * Sets the list of selected objects
     * @param {Array<THREE.Object3D>} objectList 
     */
    setSelection(objectList) {
        this.#selectedObjects = objectList;
        // TODO: mark all newly selected objects

        this.#itemSelectedEvent();
    }

    // TODO: sigle pick selection
    pick(normalizedPosition, camera) {

        this.#itemSelectedEvent();
    }

    // TODO: Rectangular selection
    pickMultiSelection(start, end) {

        this.#itemSelectedEvent();
    }

    /**
     * Inform the canvas that an item has been selected
     */
    #itemSelectedEvent() {
        const event = new CustomEvent("itemSelected", {
            detail: { object: this.#selectedObjects },
          });
          document.getElementById("canvas").dispatchEvent(event);
    }
}