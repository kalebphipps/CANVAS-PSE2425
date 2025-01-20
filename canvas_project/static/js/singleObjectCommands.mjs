import { Object3D } from "three";
import { Command } from "command";
import { Heliostat, Receiver, LightSource } from "objects";
import { SaveAndLoadHandler } from "saveAndLoadHandler";

/**
 * This class is designed for operations that target a single 'Object3D' instance.
 * It serves as a base class for commands that modify individual objects in the scene.
 */
export class SingleObjectCommand extends Command {
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
        if (new.target === SingleObjectCommand) {
            throw new Error(
                "Cannot instantiate abstract class SingleObjectCommand directly"
            );
        }
    }

    /**
     * Gets the object on which the command operates.
     */
    get object() {
        return this.#object;
    }
}

/**
 * This class  is responsible for updating a specific attribute of a ’Heliostat’ object.
 */
export class UpdateHeliostatCommand extends SingleObjectCommand {
    /**
     * The attribute to update.
     */
    #attribute;
    /**
     * The old value for the attribute.
     */
    #oldParameter;
    /**
     * The new value of the attribute.
     */
    #newParameter;

    /**
     * Initializes a new UpdateHeliostatCommand with the specified 'Heliostat' instance, attribute, and new parameter.
     * @param {Heliostat} heliostat
     * @param {String} attribute
     * @param {*} newParameter
     */
    constructor(heliostat, attribute, newParameter) {
        super(heliostat);
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getParameter(heliostat, attribute);
    }

    /**
     * Updates the attribute of the heliostat object.
     */
    execute() {
        switch (this.#attribute) {
            case "facets":
                this.object.numberOfFacets = this.#newParameter;
                break;
            case "kinematic":
                this.object.kinematicType = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateHeliostat(this.object);
    }

    /**
     * Reverts the attribute of the heliostat object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "facets":
                this.object.numberOfFacets = this.#oldParameter;
                break;
            case "kinematic":
                this.object.kinematicType = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateHeliostat(this.object);
    }

    /**
     * gets the current value of the attribute.
     * @param {Heliostat} heliostat
     * @param {String} attribute
     * @returns the current value of the attribute
     */
    #getParameter(heliostat, attribute) {
        switch (attribute) {
            case "facets":
                return heliostat.numberOfFacets;
            case "kinematic":
                return heliostat.kinematicType;
            default:
                throw new Error(`Invalid attribute: ${attribute}`);
        }
    }
}

/**
 * This class is responsible for updating a specific attribute of a 'Receiver' object.
 */
export class UpdateReceiverCommand extends SingleObjectCommand {
    /**
     * The attribute to update.
     */
    #attribute;
    /**
     * The old value for the attribute.
     */
    #oldParameter;
    /**
     * The new value of the attribute.
     */
    #newParameter;

    /**
     * Initializes a new UpdateReceiverCommand with the specified 'Receiver' instance, attribute, and new parameter.
     * @param {Receiver} receiver
     * @param {String} attribute
     * @param {*} newParameter
     */
    constructor(receiver, attribute, newParameter) {
        super(receiver);
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getParameter(receiver, attribute);
    }

    /**
     * Updates the attribute of the receiver object.
     */
    execute() {
        switch (this.#attribute) {
            case "towerType":
                this.object.towerType = this.#newParameter;
                break;
            case "normalVector":
                this.object.normalVector = this.#newParameter;
                break;
            case "planeE":
                this.object.planeE = this.#newParameter;
                break;
            case "planeU":
                this.object.planeU = this.#newParameter;
                break;
            case "curvatureE":
                this.object.curvatureE = this.#newParameter;
                break;
            case "curvatureU":
                this.object.curvatureU = this.#newParameter;
                break;
            case "resolutionE":
                this.object.resolutionE = this.#newParameter;
                break;
            case "resolutionU":
                this.object.resolutionU = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateReceiver(this.object);
    }

    /**
     * Reverts the attribute of the receiver object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "towerType":
                this.object.towerType = this.#oldParameter;
                break;
            case "normalVector":
                this.object.normalVector = this.#oldParameter;
                break;
            case "planeE":
                this.object.planeE = this.#oldParameter;
                break;
            case "planeU":
                this.object.planeU = this.#oldParameter;
                break;
            case "curvatureE":
                this.object.curvatureE = this.#oldParameter;
                break;
            case "curvatureU":
                this.object.curvatureU = this.#oldParameter;
                break;
            case "resolutionE":
                this.object.resolutionE = this.#oldParameter;
                break;
            case "resolutionU":
                this.object.resolutionU = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateReceiver(this.object);
    }

    /**
     * gets the current value of the attribute.
     * @param {Receiver} receiver
     * @param {String} attribute
     * @returns
     */
    #getParameter(receiver, attribute) {
        switch (attribute) {
            case "towerType":
                return receiver.towerType;
            case "normalVector":
                return receiver.normalVector;
            case "planeE":
                return receiver.planeE;
            case "planeU":
                return receiver.planeU;
            case "curvatureE":
                return receiver.curvatureE;
            case "curvatureU":
                return receiver.curvatureU;
            case "resolutionE":
                return receiver.resolutionE;
            case "resolutionU":
                return receiver.resolutionU;
            default:
                throw new Error(`Invalid attribute: ${attribute}`);
        }
    }
}

export class UpdateLightSourceCommand extends SingleObjectCommand {
    /**
     * The attribute to update.
     */
    #attribute;
    /**
     * The old value for the attribute.
     */
    #oldParameter;
    /**
     * The new value of the attribute.
     */
    #newParameter;

    /**
     * Initializes a new UpdateLightSourceCommand with the specified 'LightSource' instance, attribute, and new parameter.
     * @param {LightSource} lightSource
     * @param {String} attribute
     * @param {*} newParameter
     */
    constructor(lightSource, attribute, newParameter) {
        super(lightSource);
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getParameter(lightSource, attribute);
    }

    /**
     * Updates the attribute of the light source object.
     */
    execute() {
        switch (this.#attribute) {
            case "numberOfRays":
                this.object.numberOfRays = this.#newParameter;
                break;
            case "type":
                this.object.type = this.#newParameter;
                break;
            case "distributionType":
                this.object.distributionType = this.#newParameter;
                break;
            case "distributionMean":
                this.object.distributionMean = this.#newParameter;
                break;
            case "distributionCovariance":
                this.object.distributionCovariance = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateLightsource(this.object);
    }

    /**
     * Reverts the attribute of the light source object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "numberOfRays":
                this.object.numberOfRays = this.#oldParameter;
                break;
            case "type":
                this.object.type = this.#oldParameter;
                break;
            case "distributionType":
                this.object.distributionType = this.#oldParameter;
                break;
            case "distributionMean":
                this.object.distributionMean = this.#oldParameter;
                break;
            case "distributionCovariance":
                this.object.distributionCovariance = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        const saveAndLoadHandler = new SaveAndLoadHandler();
        saveAndLoadHandler.updateLightsource(this.object);
    }

    /**
     * gets the current value of the attribute.
     * @param {LightSource} lightSource
     * @param {String} attribute
     * @returns
     */
    #getParameter(lightSource, attribute) {
        switch (attribute) {
            case "numberOfRays":
                return lightSource.numberOfRays;
            case "type":
                return lightSource.type;
            case "distributionType":
                lightSource.distributionType;
            case "distributionMean":
                lightSource.distributionMean;
            case "distributionCovariance":
                lightSource.distributionCovariance;
            default:
                throw new Error(`Invalid attribute: ${attribute}`);
        }
    }
}
