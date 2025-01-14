import * as THREE from "three";
import { ModeSelector } from "./modeSelector.mjs";      // TODO: correct path


export class Picker {
    #camera;
    #transformControls;
    #selectionBox;
    #selectableGroup;
    #modeSelector;
    #selectedObjects;
    #raycaster;

    /**
     * Creates a new Picker object
     * @param {THREE.Camera} camera The camera to be used for raycasting
     * @param {THREE.TransformControls} transformControls The transform controls to be used for selected objects
     * @param {THREE.Box3Helper} selectionBox The selection box to be used for selected objects
     * @param {THREE.Group} selectableGroup The group of objects to be selected
     * @param {ModeSelector} modeSelector The mode selector to be used for selection mode
     */
    constructor(camera, transformControls, selectionBox, selectableGroup, modeSelector) {
        this.#camera = camera;
        this.#transformControls = transformControls;
        this.#selectionBox = selectionBox;
        this.#selectableGroup = selectableGroup;
        this.#modeSelector = modeSelector;
        this.#selectedObjects = [];
        this.#raycaster = new THREE.Raycaster();

        // TODO: Event listener for click
        window.addEventListener("click", (event) => {  
            const normalizedPosition = { x: event.clientX / window.innerWidth * 2 - 1, y: - (event.clientY / window.innerHeight) * 2 + 1 };
            this.pick(normalizedPosition, this.camera);
        } );

        // TODO: Event listener for Rectangular selection

        // TODO: Event listener for shift key binding to add objects to selection


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
     * @param {[]} objectList 
     */
    setSelection(objectList) {
        this.#selectedObjects = objectList;
        // TODO: mark all newly selected objects

        this.itemSelectedEvent();
    }

    // TODO: sigle pick selection
    pick(normalizedPosition, camera) {

        this.itemSelectedEvent();
    }

    // TODO: Rectangular selection
    pickMultiSelection(start, end) {

        this.itemSelectedEvent();
    }


    // TODO: Add objects to selection
    addToSelection(normalizedPosition) { 

        this.itemSelectedEvent();
    }


    /**
     * Inform the inspector that an item has been selected
     */
    itemSelectedEvent() {
        const event = new CustomEvent("itemSelected", {
            detail: { object: this.#selectedObjects },
          });
          document.getElementById("inspector").dispatchEvent(event);
    }
}