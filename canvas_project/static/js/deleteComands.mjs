import { Editor } from "editor";
import { Heliostat, LightSource, Receiver } from "objects";
import { SingleObjectCommand } from "singleObjectCommands";

/**
 * Command to handle the deletion of a heliostat.
 */
export class DeleteHeliostatCommand extends SingleObjectCommand {
    #editor = new Editor();
    #heliostat;

    /**
     * Creates an new delete command
     * @param {Heliostat} heliostat the heliostat you want to delete
     */
    constructor(heliostat) {
        super();
        this.#heliostat = heliostat;
    }

    execute() {
        this.#editor.deleteHeliostat(this.#heliostat);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#heliostat },
            })
        );
    }

    undo() {
        this.#editor.addHeliostat(this.#heliostat);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#heliostat },
            })
        );
    }
}

/**
 * Command to handle the deletion of a receiver.
 */
export class DeleteReceiverCommand extends SingleObjectCommand {
    #editor = new Editor();
    #receiver;

    /**
     * Creates an new delete command
     * @param {Receiver} receiver the receiver you want to delete
     */
    constructor(receiver) {
        super();
        this.#receiver = receiver;
    }

    execute() {
        this.#editor.deleteReceiver(this.#receiver);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#receiver },
            })
        );
    }

    undo() {
        this.#editor.addReceiver(this.#receiver);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#receiver },
            })
        );
    }
}

/**
 * Command to handle the deletion of a lightsource.
 */
export class DeleteLightSourceCommand extends SingleObjectCommand {
    #editor = new Editor();
    #lightsource;

    /**
     * Creates an new delete command
     * @param {LightSource} lightsource the lightsource you want to delete
     */
    constructor(lightsource) {
        super();
        this.#lightsource = lightsource;
    }

    execute() {
        this.#editor.deleteLightsource(this.#lightsource);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#lightsource },
            })
        );
    }

    undo() {
        this.#editor.deleteLightsource(this.#lightsource);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#lightsource },
            })
        );
    }
}
