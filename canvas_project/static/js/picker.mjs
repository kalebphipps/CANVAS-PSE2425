import * as THREE from "three";
import { SelectableObject } from "objects";

export const Mode = Object.freeze({
    NONE: "none",
    SINGLE: "single",
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

    // Additional fields
    #canvas;
    #mouse;
    #mouseDownPos;
    #isDragging;
    #selectedObject;
    // A helper group for multi-selection
    #multiSelectionGroup;
    // A map to store each object's original parent when moved into multiSelectionGroup
    #originalParents;

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
        this.#mode = "single";

        this.#canvas = document.getElementById("canvas");
        this.#mouse = new THREE.Vector2();
        this.#mouseDownPos = { x: 0, y: 0 };
        this.#isDragging = false;
        this.#selectedObject = null;

        // Group used to move multiple selected objects together
        this.#multiSelectionGroup = new THREE.Group();
        this.#selectableGroup.add(this.#multiSelectionGroup);
        this.#originalParents = new Map();

        // Mouse event listeners on the canvas
        this.#canvas.addEventListener("mousedown", (event) => {
            if (!this.#isMouseOverNavElements(event)) {
                this.#onMouseDown(event);
            }
        });
        this.#canvas.addEventListener("mousemove", (event) => {
            if (!this.#isMouseOverNavElements(event)) {
                this.#onMouseMove(event);
            }
        });
        this.#canvas.addEventListener("mouseup", (event) => {
            if (!this.#isMouseOverNavElements(event)) {
                this.#onMouseUp(event);
            }
        });
    }

    /**
     * Sets the mode for the picker.
     * @param {"none" | "single" | "rotate"} mode - The mode to set.
     */
    setMode(mode) {
        this.#mode = mode;
        if (mode === Mode.NONE) {
            this.#transformControls.detach();
        } else if (mode === Mode.SINGLE) {
            this.#transformControls.setMode("translate");
        } else {
            this.#transformControls.setMode("rotate");
        }
    }

    /**
     * Inform the canvas that an item has been selected
     */
    #itemSelectedEvent() {
        const event = new ItemSelectedEvent(this.#selectedObjects);
        document.getElementById("canvas").dispatchEvent(event);
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
        this.#deselectAll();
        this.#selectedObjects = objectList;
        if (objectList) {
            this.#selectedObject = objectList[0];
            this.#attachTransform();

            // 1. Possibility using Boxhelper
            this.#selectionBox.setFromObject(this.#selectedObject);
            this.#selectionBox.visible = true;
            /*
            // 2. Possibility using emissive color
            for (const object of objectList) {
                object.traverse((child) => {
                    if (child.type === "Mesh") {
                        child.material.emissive.set(0xff0000);
                    }
                });
            }
            */
        }

        this.#itemSelectedEvent();
    }

    #onMouseDown(event) {
        this.#isDragging = false;
        this.#mouseDownPos.x = event.clientX;
        this.#mouseDownPos.y = event.clientY;
    }

    #onMouseMove(event) {
        if (event.buttons !== 0) {
            const x = event.clientX - this.#mouseDownPos.x;
            const y = event.clientY - this.#mouseDownPos.y;
            if (Math.sqrt(x * x + y * y) > 5) {
                this.#isDragging = true;
            }
        }
    }

    #onMouseUp(event) {
        // Only calls onClick if it was a real click  and not a drag
        if (!this.#isDragging) {
            this.#onClick(event);
        } else if (this.#transformControls.object) {
            if (this.#transformControls.mode === "translate") {
                this.#selectedObject.updatePosition(this.#transformControls.object.position);
                this.#itemSelectedEvent();
            } else if (this.#transformControls.mode === "rotate") {
                this.#selectedObject.updateRotation();
                this.#itemSelectedEvent();
            }
        }
    }

    /**
     * Handles the click event on the canvas
     */
    #onClick(event) {
        if (this.#mode !== Mode.SINGLE) {
            this.#deselectAll();
            return;
        }

        // Get normalized mouse position
        this.#mouse = this.#mouseposition(
            new THREE.Vector2(event.clientX, event.clientY)
        );

        // Raycast to find the clicked object
        this.#selectedObject = this.#select(this.#mouse, this.#camera);

        // Check if the selected object is movable or rotatable
        if (this.#selectedObject) { 
            if (this.#transformControls.mode === "rotate") {
                if (!this.#selectedObject.isRotatable) {
                    console.error("selected Object is not rotatable");
                    return;
                }
            } else if (this.#transformControls.mode === "translate") {
                if (!this.#selectedObject.isMovable) { 
                    console.error("selected Object is not movable");
                    return;
                }
            }
        }

        // Update selection (handles shift-key and multi-selection)
        this.#updateSelection(event.shiftKey);

        this.#itemSelectedEvent();
    }

    /**
     * Selects an object based on the mouse position and camera
     */
    #select(mouse, camera) {
        // Raycast from the camera through the mouse position
        this.#raycaster.setFromCamera(mouse, camera);
        const intersects = this.#raycaster.intersectObjects(
            this.#selectableGroup.children,
            true
        );

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const hit = intersects[i];
                if (hit.object.type === "Mesh") {
                    // Move up the hierarchy until we find a SelectableObject
                    while (
                        hit.object.parent &&
                        !(hit.object.parent instanceof SelectableObject)
                    ) {
                        hit.object = hit.object.parent;
                    }

                    const topParent = hit.object.parent;
                    return topParent;
                }
            }
        }
        return null;
    }

    /**
     * Deselects all objects, removes transformControls, and un-highlights them.
     */
    #deselectAll() {
        // Detach transformControls
        this.#transformControls.detach();

        if (this.#selectedObjects.length === 0) {
            return;
        }
        // 1. Possibility using Boxhelper
        this.#selectionBox.visible = false;

        /*
        // 2. Possibility using emissive color
        for (const obj of this.#selectedObjects) {
            if (obj) {
                obj.traverse((child) => {
                    if (child.type === "Mesh") {
                        child.material.emissive.set(0x000000);
                    }
                });
            }
        }
        */
        this.#selectedObjects = [];
    }

    /*
     * Updates the selection based on the shift key
     * @param {Boolean} shiftKey The state of the shift key
     */
    #updateSelection(shiftKey) {
        // No object was clicked
        if (!this.#selectedObject) {
            if (!shiftKey) {
                this.#deselectAll();
            }
            return;
        }

        // Object was clicked
        if (shiftKey) {
            // If object is already in the selection, just attach transformControls
            if (this.#selectedObjects.includes(this.#selectedObject)) {
                this.#attachTransform();
            } else {
                // Add it to the selection
                this.#selectedObjects.push(this.#selectedObject);
                this.#attachTransform();
            }
        } else {
            // deselect everything, then select the clicked object
            this.#deselectAll();
            this.#selectedObjects.push(this.#selectedObject);
            this.#attachTransform();
        }
    }

    /**
     * Decides whether to attach transformControls to a single object
     * or a multiSelectionGroup that contains all currently selected objects.
     */
    #attachTransform() {
        if (this.#selectedObjects.length === 0) {
            this.#transformControls.detach();
        } else if (this.#selectedObjects.length === 1) {
            this.#transformControls.attach(this.#selectedObjects[0]);
            // 1. Posibility using Boxhelper
            this.#selectionBox.setFromObject(this.#selectedObject);
            this.#selectionBox.visible = true;

            /*
            // 2. Possibility using emissive color
            this.#selectedObject.traverse((child) => {
                if (child.type === "Mesh") {
                    child.material.emissive.set(0xff0000);
                }
            });
            */
        } else {
            // TODO: Implement multi-selection
        }
    }

    /**
     * Calculates the normalized mouse position based on the canvas
     * @param {THREE.Vector2} position of the mouse
     * @returns {THREE.Vector2} normalized mouse position
     */
    #mouseposition(position) {
        const rect = this.#canvas.getBoundingClientRect();
        return new THREE.Vector2(
            ((position.x - rect.left) / rect.width) * 2 - 1,
            -((position.y - rect.top) / rect.height) * 2 + 1
        );
    }

    // Helper method to check if the mouse is over the nav elements or their children
    #isMouseOverNavElements(event) {
        const elementUnderMouse = document.elementFromPoint(
            event.clientX,
            event.clientY
        );
        if (!elementUnderMouse) {
            return false;
        }
        return (
            elementUnderMouse.closest("#pillNav1") !== null ||
            elementUnderMouse.closest("#pillNav2") !== null
        );
    }
}

/**
 * Custom event for when an item is selected
 */
class ItemSelectedEvent extends CustomEvent {
    /**
     * Creates a new ItemSelectedEvent
     * @param {Array<THREE.Object3D>} selectedObjects The objects that were selected
     */
    constructor(selectedObjects) {
        super("itemSelected", {
            detail: { object: selectedObjects },
        });
    }
}
