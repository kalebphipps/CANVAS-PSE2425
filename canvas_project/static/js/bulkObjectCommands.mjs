import { Command } from "command";
import { Object3D } from "three";

/**
 * This class is designed for operations that target multiple 'Object3D' instances.
 * It serves as a base class for commands that modify multiple objects in the scene.
 */
export class BulkObjectCommand extends Command {
    /**
     * An array of objects on which the command operates.
     * @type {Array<Object3D>}
     */
    #objects;

    /**
     * Initializes a new BulkObjectCommand with the specified 'Object3D' instances.
     * @param {Array<Object3D>} objects - The 'Object3D' instances that this command will target.
     */
    constructor(objects) {
        super();
        this.#objects = objects;
        if (new.target === BulkObjectCommand) {
            throw new Error(
                "Cannot instantiate abstract class BulkObjectCommand directly"
            );
        }
    }
}
