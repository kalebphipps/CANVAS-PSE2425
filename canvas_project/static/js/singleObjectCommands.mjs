import { Object3D } from "three";
import { Command } from "command";
import { Heliostat, Receiver, LightSource } from "objects";
import { SaveAndLoadHandler } from "saveAndLoadHandler";
import { Editor } from "editor";

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
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue(heliostat, attribute);
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
    }

    /**
     * Updates the attribute of the heliostat object.
     */
    execute() {
        switch (this.#attribute) {
            case "numberOfFacets":
                this.object.numberOfFacets = this.#newParameter;
                break;
            case "kinematicType":
                this.object.kinematicType = this.#newParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateHeliostat(this.object);
    }

    /**
     * Reverts the attribute of the heliostat object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "numberOfFacets":
                this.object.numberOfFacets = this.#oldParameter;
                break;
            case "kinematicType":
                this.object.kinematicType = this.#oldParameter;
                break;
            default:
                throw new Error(`Invalid attribute: ${this.#attribute}`);
        }

        this.#saveAndLoadHandler.updateHeliostat(this.object);
    }

    /**
     * Gets the current value of the attribute.
     * @param {Heliostat} heliostat - The heliostat to update.
     * @param {String} attribute - The name of the attribute to modify.
     * @returns {*} the current value of the attribute.
     */
    #getAttributeValue(heliostat, attribute) {
        switch (attribute) {
            case "numberOfFacets":
                return heliostat.numberOfFacets;
            case "kinematicType":
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
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue(receiver, attribute);
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
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

        this.#saveAndLoadHandler.updateReceiver(this.object);
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

        this.#saveAndLoadHandler.updateReceiver(this.object);
    }

    /**
     * Gets the current value of the attribute.
     * @param {Receiver} receiver - The receiver to update.
     * @param {String} attribute - The name of the attribute to modify.
     * @returns {*} The current value of the specified attribute.
     */
    #getAttributeValue(receiver, attribute) {
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

/**
 * This class is responsible for updating a specific attribute of a 'LightSource' object.
 */
export class UpdateLightsourceCommand extends SingleObjectCommand {
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
        this.#attribute = attribute;
        this.#newParameter = newParameter;
        this.#oldParameter = this.#getAttributeValue(lightSource, attribute);
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
    }

    /**
     * Updates the attribute of the light source object.
     */
    execute() {
        switch (this.#attribute) {
            case "numberOfRays":
                this.object.numberOfRays = this.#newParameter;
                break;
            case "lightSourceType":
                this.object.lightSourceType = this.#newParameter;
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

        this.#saveAndLoadHandler.updateLightsource(this.object);
    }

    /**
     * Reverts the attribute of the light source object to its previous state.
     */
    undo() {
        switch (this.#attribute) {
            case "numberOfRays":
                this.object.numberOfRays = this.#oldParameter;
                break;
            case "lightSourceType":
                this.object.lightSourceType = this.#oldParameter;
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

        this.#saveAndLoadHandler.updateLightsource(this.object);
    }

    /**
     * gets the current value of the attribute.
     * @param {LightSource} lightSource - The light source to update.
     * @param {String} attribute - The name of the attribute to modify.
     * @returns {*} The current value of the specified attribute.
     */
    #getAttributeValue(lightSource, attribute) {
        switch (attribute) {
            case "numberOfRays":
                return lightSource.numberOfRays;
            case "lightSourceType":
                return lightSource.lightSourceType;
            case "distributionType":
                return lightSource.distributionType;
            case "distributionMean":
                return lightSource.distributionMean;
            case "distributionCovariance":
                return lightSource.distributionCovariance;
            default:
                throw new Error(`Invalid attribute: ${attribute}`);
        }
    }
}

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
     * Executes the command.
     */
    execute() {
        this.#editor.addObject(this.object);
    }

    /**
     * Undoes the command.
     */
    undo() {
        this.#editor.deleteObject(this.object);
    }
}
