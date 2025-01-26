import { SelectableObject } from "objects";
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
        this.#mode = Mode.SINGLE;

        this.canvas = document.getElementById("canvas");
        this.mouse = new THREE.Vector2();
        var startingPoint = new THREE.Vector2();
        var endPoint = new THREE.Vector2();
        this.isTransformDragging = false;
        this.selectedObject = null;

        

        // TODO: Event listener for click
        window.addEventListener("click", (event) => {
            
            //check if the correct mode is applied
            if (this.#mode != Mode.SINGLE) { 
                transformControls.detach();
                for (Object of this.#selectedObjects) {
                    if (Object) {
                        Object.traverse((child) => {
                            if (child.type == "Mesh") {
                                child.material.emissive.set(0x000000);
                            }
                        });
                    }
                }
                this.#selectedObjects = [];
                return; 
            }

            if (this.isTransformDragging) { return; } // während oder kurz nach Dragging nichts machen
            
            //gets the mouse position
            this.mouse = this.#mouseposition({ x: event.clientX, y: event.clientY });

            //checks if the transformationControls are currently dragging, if so calls the itemSelectedEvent to update the selected objects in the canvas
            if (this.#transformControls.dragging) { 
                this.#itemSelectedEvent();
                return;
            }
            
            //gets the selected object
            this.selectedObject = this.#getSelectedObject(this.mouse, this.#camera);

            // updates the selected objects according to the situation
            if (event.shiftKey) {
                if (this.selectedObject != null) {
                    if (this.#selectedObjects.includes(this.selectedObject)) {
                        this.#transformControls.attach(this.selectedObject);
                    } else {
                        this.#selectedObjects.push(this.selectedObject);
                        this.#transformControls.attach(this.selectedObject);
                    }
                } else {
                    this.#transformControls.detach();
                }
            } else {
                this.#transformControls.detach();
                for (Object of this.#selectedObjects) {
                    if (Object) {
                        Object.traverse((child) => {
                            if (child.type == "Mesh") {
                                child.material.emissive.set(0x000000);
                            }
                        });
                    }
                }
                this.#selectedObjects = [];

                if (this.selectedObject != null) {
                    this.#selectedObjects.push(this.selectedObject);
                    this.#transformControls.attach(this.selectedObject);
                }
            }

            this.#itemSelectedEvent();
        });

        this.#transformControls.addEventListener("dragging-changed", (event) => {
            this.isTransformDragging = !event.value;
            console.log("dragging-changed");
            setTimeout(() => {
                this.isTransformDragging = false;
            }, 100);

        });



        // TODO: Event listener for Rectangular selection
    }

    /**
     * Sets the selection mode and updats the tranformControls
     * @param {Mode} mode The selection mode
     */
    setMode(mode, transformMode) {
        this.#mode = mode;
        if (mode === Mode.NONE) {
            this.#transformControls.detach();
            this.#selectionBox.visible = false;
        } else if (mode === Mode.SINGLE || mode === Mode.RECTANGLE) {
            this.#transformControls.setMode("translate");
        } else {
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
     * @param {Array<SelectableObject>} objectList
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
