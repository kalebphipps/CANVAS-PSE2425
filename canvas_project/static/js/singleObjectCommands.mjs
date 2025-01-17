import { Object3D } from "three";
import { Command } from "command";

/**
 * This class is designed for operations that target a single 'Object3D' instance.
 * It serves as a base class for commands that modify individual objects in the scene.
 */
class SingleObjectCommand extends Command {
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
    }

    /**
     * Executes the operation on the specified 'Object3D' instance.
     * The exact behavior depends on the subclass.
     */
    execute() {
        super.execute();
    }

    /**
     * Reverts the action performed by the 'execute()' method on the same 'Object3D' instance.
     * The undo logic is specific to the subclass and restores the object to its previous state.
     */
    undo() {
        super.undo();
    }
}
