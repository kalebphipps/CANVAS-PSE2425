/**
 * Class to handle the undo and redo functionality
 */
export class UndoRedoHandler {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];

    // handle keybinds for undo and redo
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
        if (this.redoStack.length > 0) {
          const command = this.redoStack.pop();
          command.execute();
          this.undoStack.push(command);
        }
      } else if (event.ctrlKey && event.key === "z") {
        if (this.undoStack.length > 0) {
          const command = this.undoStack.pop();
          command.undo();
          this.redoStack.push(command);
        }
      }
    });
  }

  addUndo(command) {
    // empty the redo stack
    this.redoStack = [];
    this.undoStack.push(command);
  }
}
