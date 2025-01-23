import { Editor } from "editor";
import { Heliostat, LightSource, Receiver } from "objects";
import { SingleObjectCommand } from "singleObjectCommands";

/**
 * Command to duplicate a heliostat.
 */
export class DuplicateHeliostatCommand extends SingleObjectCommand {
    #editor = new Editor();
    #heliostat;
    #heliostatCopy;

    /**
     * Create the command
     * @param {Heliostat} heliostat the heliostat you want to duplicate
     */
    constructor(heliostat) {
        super();
        this.#heliostatCopy = new Heliostat(
            this.#heliostat.objectName == "" || !this.#heliostat.objectName
                ? "Heliostat_Copy"
                : this.#heliostat.objectName + "_Copy",
            this.#heliostat.position,
            this.#heliostat.aimPoint,
            this.#heliostat.numberOfFacets,
            this.#heliostat.kinematicType
        );
        this.#heliostat = heliostat;
    }

    async execute() {
        await this.#editor.addHeliostat(this.#heliostatCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#heliostat },
            })
        );
    }

    undo() {
        this.#editor.deleteHeliostat(this.#heliostatCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#heliostat },
            })
        );
    }
}

/**
 * Command to duplicate a receiver.
 */
export class DuplicateReceiverCommand extends SingleObjectCommand {
    #editor = new Editor();
    #receiver;
    #receiverCopy;

    /**
     * Create the command
     * @param {Receiver} receiver the receiver you want to duplicate
     */
    constructor(receiver) {
        super();
        this.#receiverCopy = new Receiver(
            this.#receiver.objectName == "" || !this.#receiver.objectName
                ? "Receiver_Copy"
                : this.#receiver.objectName + "_Copy",
            this.#receiver.getPosition(),
            this.#receiver.rotationY,
            this.#receiver.normalVector,
            this.#receiver.towerType,
            this.#receiver.planeE,
            this.#receiver.planeU,
            this.#receiver.resolutionE,
            this.#receiver.resolutionU,
            this.#receiver.curvatureE,
            this.#receiver.curvatureU
        );
        this.#receiver = receiver;
    }

    async execute() {
        await this.#editor.addReceiver(this.#receiverCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#receiver },
            })
        );
    }

    undo() {
        this.#editor.deleteReceiver(this.#receiverCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#receiver },
            })
        );
    }
}

/**
 * Command to duplicate a lightsource.
 */
export class DuplicateLightSourceCommand extends SingleObjectCommand {
    #editor = new Editor();
    #lightsource;
    #lightsourceCopy;

    /**
     * Create the command
     * @param {LightSource} lightsource the lightsource you want to duplicate
     */
    constructor(lightsource) {
        super();
        this.#lightsourceCopy = new LightSource(
            this.#lightsource.objectName == "" || !this.#lightsource.objectName
                ? "lightsource_Copy"
                : this.#lightsource.objectName + "_Copy",
            this.#lightsource.numberOfRays,
            this.#lightsource.lightSourceType,
            this.#lightsource.distributionType,
            this.#lightsource.distributionMean,
            this.#lightsource.distributionCovariance
        );
        this.#lightsource = lightsource;
    }

    async execute() {
        await this.#editor.addLightsource(this.#lightsourceCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemCreated", {
                detail: { item: this.#lightsource },
            })
        );
    }

    undo() {
        this.#editor.deleteLightsource(this.#lightsourceCopy);

        document.getElementById("canvas").dispatchEvent(
            new CustomEvent("itemDeleted", {
                detail: { item: this.#lightsource },
            })
        );
    }
}
