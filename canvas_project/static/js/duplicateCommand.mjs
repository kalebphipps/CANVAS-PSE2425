import { Editor } from "editor";
import { Heliostat, LightSource, Receiver } from "objects";
import { SingleObjectCommand } from "singleObjectCommands";
import { ItemCreatedEvent } from "createCommands";
import { ItemDeletedEvent } from "deleteCommands";

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
        this.#heliostat = heliostat;
        this.#heliostatCopy = new Heliostat(
            this.#heliostat.objectName == "" || !this.#heliostat.objectName
                ? "Heliostat_Copy"
                : this.#heliostat.objectName + "_Copy",
            this.#heliostat.position,
            this.#heliostat.aimPoint,
            this.#heliostat.numberOfFacets,
            this.#heliostat.kinematicType
        );
        console.log(this.#heliostat);
    }

    async execute() {
        await this.#editor.addHeliostat(this.#heliostatCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemCreatedEvent(this.#heliostat));
    }

    undo() {
        this.#editor.deleteHeliostat(this.#heliostatCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemDeletedEvent(this.#heliostat));
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
        this.#receiver = receiver;
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
    }

    async execute() {
        await this.#editor.addReceiver(this.#receiverCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemCreatedEvent(this.#receiver));
    }

    undo() {
        this.#editor.deleteReceiver(this.#receiverCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemDeletedEvent(this.#receiver));
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
        this.#lightsource = lightsource;
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
    }

    async execute() {
        await this.#editor.addLightsource(this.#lightsourceCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemCreatedEvent(this.#lightsource));
    }

    undo() {
        this.#editor.deleteLightsource(this.#lightsourceCopy);

        document
            .getElementById("canvas")
            .dispatchEvent(new ItemDeletedEvent(this.#lightsource));
    }
}
