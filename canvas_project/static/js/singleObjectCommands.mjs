import { Object3D } from "three";
import { Command } from "command";
import { Heliostat, Receiver, LightSource } from "objects";
import { SaveAndLoadHandler } from "saveAndLoadHandler";
import { Editor } from "editor";

/**
 * This class is designed for operations that target a single 'Object3D' instance.
 * It serves as a base class for commands that modify individual objects in the scene.
 */
export class SingleObjectCommand extends Command {
    /**
     * The object on which the command operates.
     * @type {Object3D}
     */
    #object;

    /**
     * Initializes a new SingleObjectCommand with the specified 'Object3D' instance.
     * @param {Object3D} object - The 'Object3D' instance that this command will target.
     */
    constructor(object) {
        super();
        this.#object = object;
        if (new.target === SingleObjectCommand) {
            throw new Error(
                "Cannot instantiate abstract class SingleObjectCommand directly"
            );
        }
    }

    /**
     * Gets the object on which the command operates.
     * @returns {Object3D} The object on which the command operates.
     */
    get object() {
        return this.#object;
    }
}

/**
 * This class is responsible for adding a new object to the scene.
 */
export class CreateObjectCommand extends SingleObjectCommand {
    /**
     * The editor instance that will be used to add the object to the scene.
     * @type {Editor}
     */
    #editor;

    /**
     * Initializes a new CreateObjectCommand with the specified object to create.
     * @param {Object3D} object - The object to create.
     */
    constructor(object) {
        super(object);
        this.#editor = new Editor();
    }

    /**
     * The object is added to the scene.
     */
    execute() {
        this.#editor.addObject(this.object);
    }

    /**
     * The object is removed from the scene.
     */
    undo() {
        this.#editor.deleteObject(this.object);
    }
}
