import { SingleObjectCommand } from "singleObjectCommands";
import { SaveAndLoadHandler } from "saveAndLoadHandler";
import { Heliostat, Receiver, LightSource } from "objects";

/**
 * This class  is responsible for updating a specific attribute of a ’Heliostat’ object.
 */
export class UpdateHeliostatCommand extends SingleObjectCommand {
    /**
     * The heliostat object to update.
     * @type {Heliostat}
     */
    #heliostat;
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
     * The SaveAndLoadHandler instance, that saves the changes.
     */
    #saveAndLoadHandler;

    /**
     * Initializes a new UpdateHeliostatCommand with the specified 'Heliostat' instance, attribute, and new parameter.
     * @param {Heliostat} heliostat - the 'Heliostat' instance to be updated.
     * @param {String} attribute - The name of the attribute to modify.
     * @param {*} newParameter - the new value to assign to the attribute.
     */
    constructor(heliostat, attribute, newParameter) {
        super(heliostat);
        this.#heliostat = heliostat;
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue();
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
    }

    /**
     * Updates the attribute of the heliostat object.
     */
    execute() {
        switch (this.#attribute) {
            case "heliostatName":
                this.#heliostat.heliostatName = this.#newParameter;
                break;
            case "numberOfFacets":
                this.#heliostat.numberOfFacets = this.#newParameter;
                break;
            case "kinematicType":
                this.#heliostat.kinematicType = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateHeliostat(this.#heliostat);
    }

    /**
     * Reverts the attribute of the heliostat object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "heliostatName":
                this.#heliostat.heliostatName = this.#oldParameter;
                break;
            case "numberOfFacets":
                this.#heliostat.numberOfFacets = this.#oldParameter;
                break;
            case "kinematicType":
                this.#heliostat.kinematicType = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateHeliostat(this.#heliostat);
    }

    /**
     * Gets the current value of the attribute.
     * @returns {*} the current value of the attribute.
     */
    #getAttributeValue() {
        switch (this.#attribute) {
            case "heliostatName":
                return this.#heliostat.heliostatName;
            case "numberOfFacets":
                return this.#heliostat.numberOfFacets;
            case "kinematicType":
                return this.#heliostat.kinematicType;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }
    }
}

/**
 * This class is responsible for updating a specific attribute of a 'Receiver' object.
 */
export class UpdateReceiverCommand extends SingleObjectCommand {
    /**
     * The receiver object to update.
     * @type {Receiver}
     */
    #receiver;
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
     * The SaveAndLoadHandler instance, that saves the changes.
     */
    #saveAndLoadHandler;

    /**
     * Initializes a new UpdateReceiverCommand with the specified 'Receiver' instance, attribute, and new parameter.
     * @param {Receiver} receiver - This is the receiver object whose attribute will be updated.
     * @param {String} attribute - The name of the attribute to modify.
     * @param {*} newParameter - The new value to assign to the attribute. This can be of any type depending on the attribute being updated.
     */
    constructor(receiver, attribute, newParameter) {
        super(receiver);
        this.#receiver = receiver;
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue();
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
    }

    /**
     * Updates the attribute of the receiver object.
     */
    execute() {
        switch (this.#attribute) {
            case "receiverName":
                this.#receiver.receiverName = this.#newParameter;
                break;
            case "towerType":
                this.#receiver.towerType = this.#newParameter;
                break;
            case "normalVector":
                this.#receiver.normalVector = this.#newParameter;
                break;
            case "planeE":
                this.#receiver.planeE = this.#newParameter;
                break;
            case "planeU":
                this.#receiver.planeU = this.#newParameter;
                break;
            case "curvatureE":
                this.#receiver.curvatureE = this.#newParameter;
                break;
            case "curvatureU":
                this.#receiver.curvatureU = this.#newParameter;
                break;
            case "resolutionE":
                this.#receiver.resolutionE = this.#newParameter;
                break;
            case "resolutionU":
                this.#receiver.resolutionU = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateReceiver(this.#receiver);
    }

    /**
     * Reverts the attribute of the receiver object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "receiverName":
                this.#receiver.receiverName = this.#oldParameter;
                break;
            case "towerType":
                this.#receiver.towerType = this.#oldParameter;
                break;
            case "normalVector":
                this.#receiver.normalVector = this.#oldParameter;
                break;
            case "planeE":
                this.#receiver.planeE = this.#oldParameter;
                break;
            case "planeU":
                this.#receiver.planeU = this.#oldParameter;
                break;
            case "curvatureE":
                this.#receiver.curvatureE = this.#oldParameter;
                break;
            case "curvatureU":
                this.#receiver.curvatureU = this.#oldParameter;
                break;
            case "resolutionE":
                this.#receiver.resolutionE = this.#oldParameter;
                break;
            case "resolutionU":
                this.#receiver.resolutionU = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateReceiver(this.#receiver);
    }

    /**
     * Gets the current value of the attribute.
     * @returns {*} The current value of the specified attribute.
     */
    #getAttributeValue() {
        switch (this.#attribute) {
            case "receiverName":
                return this.#receiver.receiverName;
            case "towerType":
                return this.#receiver.towerType;
            case "normalVector":
                return this.#receiver.normalVector;
            case "planeE":
                return this.#receiver.planeE;
            case "planeU":
                return this.#receiver.planeU;
            case "curvatureE":
                return this.#receiver.curvatureE;
            case "curvatureU":
                return this.#receiver.curvatureU;
            case "resolutionE":
                return this.#receiver.resolutionE;
            case "resolutionU":
                return this.#receiver.resolutionU;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }
    }
}

/**
 * This class is responsible for updating a specific attribute of a 'LightSource' object.
 */
export class UpdateLightsourceCommand extends SingleObjectCommand {
    /**
     * The lightsource object to update.
     */
    #lightsource;
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
     * The SaveAndLoadHandler instance, that saves the changes.
     */
    #saveAndLoadHandler;

    /**
     * Initializes a new UpdateLightSourceCommand with the specified 'LightSource' instance, attribute, and new parameter.
     * @param {LightSource} lightSource - This is the lightsource object whose attribute will be updated.
     * @param {String} attribute - The name of the attribute to modify.
     * @param {*} newParameter - The new value to assign to the attribute.
     */
    constructor(lightSource, attribute, newParameter) {
        super(lightSource);
        this.#lightsource = lightSource;
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue();
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
    }

    /**
     * Updates the attribute of the light source object.
     */
    execute() {
        switch (this.#attribute) {
            case "lightsourceName":
                this.#lightsource.lightsourceName = this.#newParameter;
                break;
            case "numberOfRays":
                this.#lightsource.numberOfRays = this.#newParameter;
                break;
            case "lightSourceType":
                this.#lightsource.lightSourceType = this.#newParameter;
                break;
            case "distributionType":
                this.#lightsource.distributionType = this.#newParameter;
                break;
            case "distributionMean":
                this.#lightsource.distributionMean = this.#newParameter;
                break;
            case "distributionCovariance":
                this.#lightsource.distributionCovariance = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateLightsource(this.#lightsource);
    }

    /**
     * Reverts the attribute of the light source object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "lightsourceName":
                this.#lightsource.lightsourceName = this.#oldParameter;
                break;
            case "numberOfRays":
                this.#lightsource.numberOfRays = this.#oldParameter;
                break;
            case "lightSourceType":
                this.#lightsource.lightSourceType = this.#oldParameter;
                break;
            case "distributionType":
                this.#lightsource.distributionType = this.#oldParameter;
                break;
            case "distributionMean":
                this.#lightsource.distributionMean = this.#oldParameter;
                break;
            case "distributionCovariance":
                this.#lightsource.distributionCovariance = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateLightsource(this.#lightsource);
    }

    /**
     * gets the current value of the attribute.
     * @returns {*} The current value of the specified attribute.
     */
    #getAttributeValue() {
        switch (this.#attribute) {
            case "lightsourceName":
                return this.#lightsource.lightsourceName;
            case "numberOfRays":
                return this.#lightsource.numberOfRays;
            case "lightSourceType":
                return this.#lightsource.lightSourceType;
            case "distributionType":
                return this.#lightsource.distributionType;
            case "distributionMean":
                return this.#lightsource.distributionMean;
            case "distributionCovariance":
                return this.#lightsource.distributionCovariance;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }
    }
}
