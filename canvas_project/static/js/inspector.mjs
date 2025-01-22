import * as THREE from "three";
import { Object3D } from "three";
import { Picker } from "picker";
import { UndoRedoHandler } from "undoRedoHandler";

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
        this.#inspectorSelection = null;

        console.log("inspector loaded");
        const inspectorHTML = document.getElementById("inspector");
        inspectorHTML.innerHTML = "Select a object by clicking on it";

        inspectorHTML.addEventListener("itemSelected", (event) => {
            console.log("hilfeeee");
            if (event.detail.object.length > 0) {
                console.log(
                    "event.detail.object[0].type: " +
                        event.detail.object[0].type
                );
                this.render();
            } else {
                inspectorHTML.innerHTML = "Select a object by clicking on it";
            }
        });
    }

    render() {
        this.#inspectorSelection = this.createInspectorSelection(
            this.#picker.getSelectedObjects()
        );
        this.#inspectorSelection.renderSeleciton();
    }

    createInspectorSelection(selectedObjects) {
        if (selectedObjects.length === 1) {
            if (selectedObjects[0].type === "heliostat") {
                console.log("ziemlich weit hihi");
                return new HeliostatSelection();
            } else if (selectedObjects[0].type === "receiver") {
                return new ReceiverSelection();
            } else if (selectedObjects[0].type === "lightsource") {
                return new LightSourceSelection();
            }
        } else {
            return new GroupSelection(selectedObjects);
        }
    }
}

export class InspectorSelection {
    renderSeleciton() {}
}

export class HeliostatSelection extends InspectorSelection {
    #heliostat;

    constructor(selectedHeliostat) {
        super();
        this.#heliostat = selectedHeliostat;
    }

    renderSeleciton() {
        const inspectorHTML = document.getElementById("inspector");
        const template = /** @type {HTMLTemplateElement} */ (
            document.getElementById("test-test")
        );
        if (!template) {
            console.error("Template not found");
            return;
        }

        const clone = template.content.cloneNode(true);
        let tempHTML = new XMLSerializer().serializeToString(clone);

        inspectorHTML.innerHTML = tempHTML;
    }
}

export class ReceiverSelection extends InspectorSelection {
    #receiver;

    constructor(selectedReceiver) {
        super();
        this.#receiver = selectedReceiver;
    }

    renderSeleciton() {}
}

export class LightSourceSelection extends InspectorSelection {
    #lightSource;

    constructor(selectedLightSource) {
        super();
        this.#lightSource = selectedLightSource;
    }

    renderSeleciton() {}
}

export class GroupSelection extends InspectorSelection {
    #selectedObjects;

    constructor(selectedObjects) {
        super();
        this.#selectedObjects = selectedObjects;
    }

    renderSeleciton() {}
}
