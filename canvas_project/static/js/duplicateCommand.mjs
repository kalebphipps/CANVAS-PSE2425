import { Editor } from "editor";
import { Heliostat } from "objects";
import { SingleObjectCommand } from "singleObjectCommands";

/**
 * Command to duplicate a heliost.
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
        super(heliostat);
        this.#heliostat = heliostat;
    }

    async execute() {
        console.log(this.#heliostat);
        this.#heliostatCopy = new Heliostat(
            this.#heliostat.objectName == "" || !this.#heliostat.objectName
                ? "Heliostat_Copy"
                : this.#heliostat.objectName + "_Copy",
            this.#heliostat.position,
            this.#heliostat.aimPoint,
            this.#heliostat.numberOfFacets,
            this.#heliostat.kinematicType
        );
        await this.#editor.addHeliostat(this.#heliostatCopy);
    }

    undo() {
        this.#editor.deleteHeliostat(this.#heliostatCopy);
    }
}
