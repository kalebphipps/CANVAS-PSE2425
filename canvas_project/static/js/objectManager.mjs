import { Picker } from "picker";
import { UndoRedoHandler } from "undoRedoHandler";
import { Editor } from "editor";
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
    #editor;
    #inspector;
    #objectList;

    /**
     *
     * @param {Picker} picker
     * @param {UndoRedoHandler} undoRedoHandler
     */
    constructor(picker, undoRedoHandler, inspector) {
        this.#picker = picker;
        this.#undoRedoHandler = undoRedoHandler;
        this.#editor = new Editor();
        this.#inspector = inspector;

        this.#addEventListener();
    }

    createHeliostat() {
        const id = String(this.#editor.objects.heliostatList.length + 1);
        const heliostat = new Heliostat(
            id,
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
        this.#inspector.openPane();
    }

    createReceiver() {
        const id = String(this.#editor.objects.receiverList.length + 1);
        const receiver = new Receiver(
            id,
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
        this.#inspector.openPane();
    }

    createLightSource() {
        const id = String(this.#editor.objects.lightsourceList.length + 1);
        const lightSource = new LightSource(id, 1, "sun", "normal", 1, 1);
        this.#undoRedoHandler.executeCommand(
            new CreateLightSourceCommand(lightSource)
        );
        let selectedObject = [lightSource];
        this.#picker.setSelection(selectedObject);
        this.#inspector.openPane();
    }

    #addEventListener() {
        window.addEventListener("keydown", (event) => {
            this.#objectList = this.#picker.getSelectedObjects();

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
        });

        window.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "b") {
                if (this.#objectList[0] instanceof Heliostat) {
                    this.#undoRedoHandler.executeCommand(
                        new DuplicateHeliostatCommand(this.#objectList[0])
                    );
                } else if (this.#objectList[0] instanceof Receiver) {
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
}
