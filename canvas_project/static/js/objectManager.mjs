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
import { Inspector } from "inspectorClass";

export class ObjectManager {
    #picker;
    #undoRedoHandler;
    #editor;
    #inspector;

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
            new Vector3(0, 0, 0),
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
}
