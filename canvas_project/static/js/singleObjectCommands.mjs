import { Command } from "command";
import { SelectableObject } from "objects";

/**
 * This class is designed for operations that target a single 'SelectableObject' instance.
 * It serves as a base class for commands that modify individual objects in the scene.
 */
export class SingleObjectCommand extends Command {
    /**
     * The object on which the command operates.
     * @type {SelectableObject}
     */
    #object;

    /**
     * Initializes a new SingleObjectCommand with the specified 'SelectableObject' instance.
     * @param {SelectableObject} object - The 'SelectableObject' instance that this command will target.
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
     */
    get object() {
        return this.#object;
    }
}
