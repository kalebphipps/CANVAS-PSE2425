import { SingleObjectCommand } from "singleObjectCommands";
import { Editor } from "editor";
import { Object3D } from "three";
import { Heliostat, Receiver, LightSource } from "objects";

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
     * Gets the editor instance that will be used to add or remove the object to the scene.
     */
    get editor() {
        return this.#editor;
    }
}

/**
 * This class is responsible for adding a new light source to the scene.
 */
export class CreateHeliostatCommand extends CreateObjectCommand {
    /**
     * The heliostat to create.
     * @type {Heliostat}
     */
    #heliostat;

    /**
     * Initializes a new CreateHeliostatCommand with the specified heliostat to create.
     * @param {Heliostat} heliostat
     */
    constructor(heliostat) {
        super(heliostat);
        this.#heliostat = heliostat;
    }

    /**
     * The heliostat is added to the scene
     */
    execute() {
        this.editor.addHeliostat(this.#heliostat);
    }

    /**
     * The heliostat is removed from the scene.
     */
    undo() {
        this.editor.deleteHeliostat(this.#heliostat);
    }
}

/**
 * This class is responsible for adding a new light source to the scene.
 */
export class CreateReceiverCommand extends CreateObjectCommand {
    /**
     * The receiver to create.
     * @type {Receiver}
     */
    #receiver;

    /**
     * Initializes a new CreateReceiverCommand with the specified receiver to create.
     * @param {Receiver} receiver
     */
    constructor(receiver) {
        super(receiver);
        this.#receiver = receiver;
    }

    /**
     * The receiver is added to the scene.
     */
    execute() {
        this.editor.addReceiver(this.#receiver);
    }

    /**
     * The receiver is removed from the scene.
     */
    undo() {
        this.editor.deleteReceiver(this.#receiver);
    }
}

/**
 * This class is responsible for adding a new light source to the scene.
 */
export class CreateLightSourceCommand extends CreateObjectCommand {
    /**
     * The light source to create.
     * @type {LightSource}
     */
    #lightSource;

    /**
     * Initializes a new CreateLightSourceCommand with the specified light source to create.
     * @param {LightSource} lightSource
     */
    constructor(lightSource) {
        super(lightSource);
        this.#lightSource = lightSource;
    }

    /**
     * The light source is added to the scene.
     */
    execute() {
        this.editor.addLightSource(this.#lightSource);
    }

    /**
     * The light source is removed from the scene.
     */
    undo() {
        this.editor.deleteLightSource(this.#lightSource);
    }
}
