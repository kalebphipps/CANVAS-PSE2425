import { Command } from "static/js/command.mjs";

/**
 * This class manages the execution of commands and provides undo/redo functionality.
 * It maintains two stacks to keep track of executed and undone commands, allowing users to reverse or reapply actions seamlessly.
 */
class UndoRedoHandler {
    #undoStack;
    #redoStack;

    /**
     * Initializes a new instance of the UndoRedoHandler class.
     * Sets up the undo and redo stacks with a maximum size of 100 commands each.
     */
    constructor() {
        /**
         * A stack that stores commands that have been executed.
         * The stack has a maximum size of 100 commands, and any excess commands will result in the oldest commands
         * being removed to make room for new ones.
         * @type {Array<Command>}
         */
        this.#undoStack = [];
        /**
         * A stack that stores commands that have been undone.
         * The stack has a maximum size of 100 commands, and any excess commands will result in the oldest commands
         * being removed to make room for new ones.
         * @type {Array<Command>}
         */
        this.#redoStack = [];
    }

    /**
     * Executes the command, performing the associated action. After execution, the command is added to the undoStack
     * Side effect: The redoStack is cleared, as executing a new command invalidates any previous redo history.
     * @param {Command} command - The command to execute.
     */
    executeCommand(command) {
        command.execute();
        this.#undoStack.push(command);
        if (this.#undoStack.length > 100) {
            this.#undoStack.shift();
        }
        this.#redoStack = [];
    }

    /**
     * Reverts the most recent action by invoking the undo method of the command at the top of the undoStack.
     */
    undo() {
        if (this.#undoStack.length > 0) {
            /** @type {Command} */
            const command = this.#undoStack.pop();
            command.undo();
            this.#redoStack.push(command);
            if (this.#redoStack.length > 100) {
                this.#redoStack.shift();
            }
        }
    }

    /**
     * Re-applies the most recently undone action by invoking the execute method of the command at the
     * top of the redoStack.
     */
    redo() {
        if (this.#redoStack.length > 0) {
            /** @type {Command} */
            const command = this.#redoStack.pop();
            command.redo();
            this.#undoStack.push(command);
            if (this.#undoStack.length > 100) {
                this.#undoStack.shift();
            }
        }
    }
}