import { Command } from "command";

/**
 * This class is designed for operations that target a single 'SelectableObject' instance.
 * It serves as a base class for commands that modify individual objects in the scene.
 */
export class SingleObjectCommand extends Command {
    /**
     * Initializes a new SingleObjectCommand.
     */
    constructor() {
        super();
        if (new.target === SingleObjectCommand) {
            throw new Error(
                "Cannot instantiate abstract class SingleObjectCommand directly"
            );
        }
    }
}
