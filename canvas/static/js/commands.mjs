import * as THREE from "three";

/**
 * Interface for a command
 */
export class Command {
  /**
   * Executes the command
   */
  execute() {
    throw console.error();
  }

  /**
   * Undos the command
   */
  undo() {
    throw console.error();
  }
}

/**
 * Command to update the position of an object.
 */
export class UpdatePositionCommand extends Command {
  /**
   * Creates a new command
   * @param {THREE.Object3D} object - Is the object (or group) you want to move
   * @param {THREE.Vector3} new_position - Is the new position for the object
   * @param {THREE.Vector3} old_position - Is the old position before moving
   */
  constructor(object, new_position, old_position) {
    super();

    this.object = object;
    this.new_position = new_position;
    this.old_position = old_position;
  }

  execute() {
    this.object.position.copy(this.new_position);
  }

  undo() {
    this.object.position.copy(this.old_position);
  }
}

// TODO: Add other commands
