import * as THREE from "three";
import { SelectableObject } from "objects";

export const Mode = Object.freeze({
    NONE: "none",
    MOVE: "move",
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
        this.#mode = Mode.MOVE;

        this.#canvas = document.getElementById("canvas");
        this.#mouse = new THREE.Vector2();
        this.#mouseDownPos = { x: 0, y: 0 };
        this.#isDragging = false;
        this.#selectedObject = null;

        // Mouse event listeners on the canvas
        this.#canvas.children[
            this.#canvas.children.length - 1
        ].addEventListener("mousedown", (event) => {
            this.#onMouseDown(event);
        });
        this.#canvas.children[
            this.#canvas.children.length - 1
        ].addEventListener("mousemove", (event) => {
            this.#onMouseMove(event);
        });
        this.#canvas.children[
            this.#canvas.children.length - 1
        ].addEventListener("mouseup", (event) => {
            this.#onMouseUp(event);
        });
    }

    /**
     * Sets the mode for the picker.
     * @param {"none" | "move" | "rotate"} mode - The mode to set.
     */
    setMode(mode) {
        this.#mode = mode;
        if (mode === Mode.NONE) {
            this.#transformControls.detach();
        } else if (mode === Mode.MOVE) {
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

            this.#selectionBox.setFromObject(this.#selectedObject);
            // Only show the selection box if the object has a position in the scene
            if (this.#selectedObjects.position !== undefined) {
                this.#selectionBox.visible = true;
            }
        }

        this.#itemSelectedEvent();
    }

    /**
     * @param {MouseEvent} event
     */
    #onMouseDown(event) {
        this.#isDragging = false;
        this.#mouseDownPos.x = event.clientX;
        this.#mouseDownPos.y = event.clientY;
    }

    /**
     * @param {MouseEvent} event
     */
    #onMouseMove(event) {
        if (event.buttons !== 0) {
            const x = event.clientX - this.#mouseDownPos.x;
            const y = event.clientY - this.#mouseDownPos.y;
            if (Math.sqrt(x * x + y * y) > 5) {
                this.#isDragging = true;
            }
        }
    }

    /**
     * @param {MouseEvent} event
     */
    #onMouseUp(event) {
        // Only calls onClick if it was a real click  and not a drag
        if (!this.#isDragging) {
            this.#onClick(event);
        } else if (this.#transformControls.object) {
            if (this.#transformControls.mode === "translate") {
                this.#selectedObject.updateAndSaveObjectPosition(
                    this.#transformControls.object.position.clone()
                );
                this.#itemSelectedEvent();
            } else if (this.#transformControls.mode === "rotate") {
                //TODO: auch mit Commands Updaten
                /*
                this.#selectedObject.updateRotation(
                    this.#transformControls.object.rotation
                );
                */
                this.#itemSelectedEvent();
            }
        }
    }

    /**
     * Handles the click event on the canvas
     * @param {MouseEvent} event
     */
    #onClick(event) {
        if (this.#mode !== Mode.MOVE && this.#mode !== Mode.ROTATE) {
            this.#deselectAll();
            return;
        }

        // Get normalized mouse position
        this.#mouse = this.#mouseposition(
            new THREE.Vector2(event.clientX, event.clientY)
        );

        // Raycast to find the clicked object
        this.#selectedObject = this.#select(this.#mouse, this.#camera);

        // Update selection (handles ctrl-key and multi-selection)
        this.#updateSelection(event.ctrlKey);

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
        this.#transformControls.showX = true;
        this.#transformControls.showZ = true;
        this.#transformControls.showY = true;
        this.#selectionBox.visible = false;
        this.#selectedObjects = [];
    }

    deselectObject() {
        this.#deselectAll();
        this.#itemSelectedEvent();
    }

    /*
     * Updates the selection based on the ctrlKey
     * @param {Boolean} ctrlKey The state of the ctrlKey
     */
    #updateSelection(ctrlKey) {
        // No object was clicked
        if (!this.#selectedObject) {
            if (!ctrlKey) {
                this.#deselectAll();
            }
            return;
        }

        // Object was clicked
        if (ctrlKey) {
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
            this.#deselectAll();
        } else if (this.#selectedObjects.length === 1) {
            if (this.#transformControls.mode === "rotate") {
                if (!this.#selectedObject.rotatableAxis) {
                    this.#selectionBox.setFromObject(this.#selectedObject);
                    this.#selectionBox.visible = true;
                    return;
                }
                this.#selectedObject.rotatableAxis.forEach((axis) => {
                    this.#transformControls.showX = false;
                    this.#transformControls.showZ = false;
                    this.#transformControls.showY = false;
                    if (axis === "X") {
                        this.#transformControls.showX = true;
                    }
                    if (axis === "Y") {
                        this.#transformControls.showY = true;
                    }
                    if (axis === "Z") {
                        this.#transformControls.showZ = true;
                    }
                });
            } else if (this.#transformControls.mode === "translate") {
                if (!this.#selectedObject.isMovable) {
                    this.#selectionBox.setFromObject(this.#selectedObject);
                    this.#selectionBox.visible = true;
                    return;
                }
            }

            this.#transformControls.attach(this.#selectedObjects[0]);
            this.#selectionBox.setFromObject(this.#selectedObject);
            this.#selectionBox.visible = true;
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
