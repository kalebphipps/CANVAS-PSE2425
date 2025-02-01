import { Picker } from "picker";
import { UndoRedoHandler } from "undoRedoHandler";
import { Heliostat, Receiver, LightSource } from "objects";
import { Vector3 } from "three";
import {
    CreateReceiverCommand,
    CreateHeliostatCommand,
    CreateLightSourceCommand,
} from "createCommands";
import {
    DeleteHeliostatCommand,
    DeleteLightSourceCommand,
    DeleteReceiverCommand,
} from "deleteCommands";
import {
    DuplicateHeliostatCommand,
    DuplicateReceiverCommand,
    DuplicateLightSourceCommand,
} from "duplicateCommands";

export class ObjectManager {
    #picker;
    #undoRedoHandler;
    #objectList;
    #inspectorPane;
    #inspectorTabButton;
    #settingsButton;
    #overviewButton;

    /**
     *
     * @param {Picker} picker
     * @param {UndoRedoHandler} undoRedoHandler
     *
     * Constructor for the object manager
     */
    constructor(picker, undoRedoHandler) {
        this.#picker = picker;
        this.#undoRedoHandler = undoRedoHandler;

        this.#addEventListener();
    }

    /**
     * Method to create a heliostat
     */
    createHeliostat() {
        const heliostat = new Heliostat(
            "Heliostat",
            new Vector3(-15, 0, -15),
            new Vector3(0, 0, 0),
            4,
            "ideal"
        );
        this.#undoRedoHandler.executeCommand(
            new CreateHeliostatCommand(heliostat)
        );
        let selectedObject = [heliostat];
        this.#picker.setSelection(selectedObject);
        this.#openInspector();
    }

    /**
     * Method to create a receiver
     */
    createReceiver() {
        const receiver = new Receiver(
            "Receiver",
            new Vector3(0, 50, 0),
            50,
            new Vector3(0, 0, 0),
            "round",
            0,
            0,
            0,
            0,
            0,
            0
        );
        this.#undoRedoHandler.executeCommand(
            new CreateReceiverCommand(receiver)
        );

        let selectedObject = [receiver];
        this.#picker.setSelection(selectedObject);
        this.#openInspector();
    }

    /**
     * Method to create a light source
     */
    createLightSource() {
        const lightSource = new LightSource(
            "Lightsource",
            1,
            "sun",
            "normal",
            1,
            1
        );
        this.#undoRedoHandler.executeCommand(
            new CreateLightSourceCommand(lightSource)
        );
        let selectedObject = [lightSource];
        this.#picker.setSelection(selectedObject);
        this.#openInspector();
    }

    /**
     * Add event listener for keyboard shortcuts
     * Delete: Delete selected object
     * Duplicate: Duplicate selected object
     */
    #addEventListener() {
        window.addEventListener("keydown", (event) => {
            this.#objectList = this.#picker.getSelectedObjects();
            if (this.#objectList.length === 0) {
                return;
            }

            // Delete object
            if (
                event.key === "Delete" ||
                event.keyCode === 46 ||
                event.code === "Delete"
            ) {
                if (this.#objectList.length === 1) {
                    if (this.#objectList[0] instanceof Heliostat) {
                        this.#undoRedoHandler.executeCommand(
                            new DeleteHeliostatCommand(this.#objectList[0])
                        );
                    } else if (this.#objectList[0] instanceof Receiver) {
                        this.#undoRedoHandler.executeCommand(
                            new DeleteReceiverCommand(this.#objectList[0])
                        );
                    } else if (this.#objectList[0] instanceof LightSource) {
                        this.#undoRedoHandler.executeCommand(
                            new DeleteLightSourceCommand(this.#objectList[0])
                        );
                    }
                }
            }

            // Duplicate object
            if (
                ((event.ctrlKey || event.metaKey) && event.key === "d") ||
                event.key === "D"
            ) {
                event.preventDefault();
                console.log("Duplicae: ", this.#objectList[0]);
                if (this.#objectList[0] instanceof Heliostat) {
                    this.#undoRedoHandler.executeCommand(
                        new DuplicateHeliostatCommand(this.#objectList[0])
                    );
                } else if (this.#objectList[0] instanceof Receiver) {
                    console.log("Duplicate Receiver");
                    this.#undoRedoHandler.executeCommand(
                        new DuplicateReceiverCommand(this.#objectList[0])
                    );
                } else if (this.#objectList[0] instanceof LightSource) {
                    this.#undoRedoHandler.executeCommand(
                        new DuplicateLightSourceCommand(this.#objectList[0])
                    );
                }
            }
        });
    }

    /**
     * Method to open the inspector pane when an object is added
     */
    #openInspector() {
        this.#inspectorPane = document.getElementById("object-tab-pane");
        this.#inspectorPane.classList.add("show", "active");

        this.#inspectorTabButton = document.getElementById("object-tab");
        this.#inspectorTabButton.classList.add("show", "active", "clicked");

        this.#overviewButton = document.getElementById("overview-tab");
        this.#overviewButton.classList.remove("show", "active", "clicked");

        this.#settingsButton = document.getElementById("project-tab");
        this.#settingsButton.classList.remove("show", "active", "clicked");
    }
}
