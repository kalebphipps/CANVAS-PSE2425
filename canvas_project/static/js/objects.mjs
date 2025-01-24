import {
    HeaderInspectorComponent,
    InspectorComponent,
    MultiFieldInspectorComponent,
    SelectFieldInspectorComponent,
    SingleFieldInspectorComponent,
} from "inspectorComponents";
import * as THREE from "three";
import { Vector3 } from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { UndoRedoHandler } from "undoRedoHandler";
import { UpdateHeliostatCommand } from "updateCommands";

export class SelectableObject extends Object3D {
    #objectName;
    /**
     * @type {InspectorComponent[]}
     */
    #inspectorComponents;

    /**
     * Creates a new selectable object
     * @param {String} name the name of the object
     */
    constructor(name, Inspe) {
        super();
        this.#objectName = name;
    }

    get objectName() {
        return this.#objectName;
    }

    set objectName(name) {
        this.#objectName = name;
    }

    /**
     * @returns {InspectorComponent[]}
     */
    get inspectorComponents() {
        throw new Error("This method must be implemented in all subclasses");
    }

    /**
     * Updates an saves the new name through a command
     * @param {String} name the new name you want to save and update
     */
    updateAndSaveObjectName(name) {
        throw new Error("This method must be implemented in all subclasses");
    }
}

/**
 *  Class that represents the Heliostat object
 */
export class Heliostat extends SelectableObject {
    #apiID;
    #aimPoint;
    #numberOfFacets;
    #kinematicType;
    #undoRedoHandler;
    #headerComponent;
    #positionComponent;
    #aimPointComponent;
    #numberOfFacetsComponent;
    #kinematicTypeComponent;

    /**
     * Creates a Heliostat object
     * @param {Number} [apiID=null] The id for api usage
     * @param {String} heliostatName the name of the heliostat
     * @param {THREE.Vector3} position The position of the heliostat.
     * @param {THREE.Vector3} aimPoint The Point the Heliostat is aiming at.
     * @param {Number} numberOfFacets Number of Facets the Heliostat has.
     * @param {String} kinematicType The type of kinematic the Heliostat has.
     */

    constructor(
        heliostatName,
        position,
        aimPoint,
        numberOfFacets,
        kinematicType,
        apiID = null
    ) {
        super(heliostatName);
        this.loader = new GLTFLoader();
        this.mesh;
        this.loader.load("/static/models/heliostat.glb", (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            this.add(this.mesh);
        });
        this.position.copy(position);
        this.#apiID = apiID;
        this.#aimPoint = aimPoint;
        this.#numberOfFacets = numberOfFacets;
        this.#kinematicType = kinematicType;
        this.#undoRedoHandler = new UndoRedoHandler();

        // create components for inspector
        this.#headerComponent = new HeaderInspectorComponent(
            () => this.objectName,
            (name) => this.updateAndSaveObjectName(name)
        );

        const nCoordinate = new SingleFieldInspectorComponent(
            "N",
            "number",
            () => this.position.x,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "position",
                        new Vector3(newValue, this.position.y, this.position.z)
                    )
                );
            }
        );

        const uCoordinate = new SingleFieldInspectorComponent(
            "U",
            "number",
            () => this.position.y,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "position",
                        new Vector3(this.position.x, newValue, this.position.z)
                    )
                );
            }
        );

        const eCoordinate = new SingleFieldInspectorComponent(
            "E",
            "number",
            () => this.position.z,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "position",
                        new Vector3(this.position.x, this.position.y, newValue)
                    )
                );
            }
        );

        this.#positionComponent = new MultiFieldInspectorComponent("Position", [
            nCoordinate,
            uCoordinate,
            eCoordinate,
        ]);

        const nAimpoint = new SingleFieldInspectorComponent(
            "N",
            "number",
            () => this.#aimPoint.x,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "aimPoint",
                        new Vector3(newValue, this.position.y, this.position.z)
                    )
                );
            }
        );

        const uAimpoint = new SingleFieldInspectorComponent(
            "U",
            "number",
            () => this.#aimPoint.y,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "aimPoint",
                        new Vector3(
                            this.#aimPoint.x,
                            newValue,
                            this.#aimPoint.z
                        )
                    )
                );
            }
        );

        const eAimpoint = new SingleFieldInspectorComponent(
            "E",
            "number",
            () => this.#aimPoint.z,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(
                        this,
                        "aimPoint",
                        new Vector3(
                            this.#aimPoint.x,
                            this.#aimPoint.y,
                            newValue
                        )
                    )
                );
            }
        );

        this.#aimPointComponent = new MultiFieldInspectorComponent("Aimpoint", [
            nAimpoint,
            uAimpoint,
            eAimpoint,
        ]);

        this.#numberOfFacetsComponent = new SingleFieldInspectorComponent(
            "Number of facets",
            "number",
            () => this.#numberOfFacets,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(this, "numberOfFacets", newValue)
                );
            }
        );

        this.#kinematicTypeComponent = new SelectFieldInspectorComponent(
            "Kinematic type",
            [{ label: "ideal", value: "ideal" }],
            () => this.#kinematicType,
            (newValue) => {
                this.#undoRedoHandler.executeCommand(
                    new UpdateHeliostatCommand(this, "kinematicType", newValue)
                );
            }
        );
    }

    /**
     * Updates the position of the heliostat
     * @param {THREE.Vector3} position the new position
     */
    updatePosition(position) {
        this.position.copy(position);
        this.lookAt(this.#aimPoint.x, 0, this.#aimPoint.z);
    }

    /**
     * @param {String} name the new name for the object
     */
    updateAndSaveObjectName(name) {
        this.#undoRedoHandler.executeCommand(
            new UpdateHeliostatCommand(this, "objectName", name)
        );
    }

    /**
     * Updates the aimPoint of the Heliostat and updates rotation of the Heliostat accordingly
     * @param {THREE.Vector3} aimPoint
     */
    set aimPoint(aimPoint) {
        this.#aimPoint = aimPoint;
        this.lookAt(aimPoint.x, 0, aimPoint.z);
    }

    get aimPoint() {
        return this.#aimPoint;
    }

    get apiID() {
        return this.#apiID;
    }

    set apiID(value) {
        this.#apiID = value;
    }

    get numberOfFacets() {
        return this.#numberOfFacets;
    }

    set numberOfFacets(numberOfFacets) {
        this.#numberOfFacets = numberOfFacets;
    }

    get kinematicType() {
        return this.#kinematicType;
    }

    set kinematicType(kinematicType) {
        this.#kinematicType = kinematicType;
    }

    get inspectorComponents() {
        return [
            this.#headerComponent,
            this.#positionComponent,
            this.#aimPointComponent,
            this.#numberOfFacetsComponent,
            this.#kinematicTypeComponent,
        ];
    }
}

/**
 * Class that represents the receiver object
 */
export class Receiver extends SelectableObject {
    #apiID;
    #towerType;
    #normalVector;
    #planeE;
    #planeU;
    #resolutionE;
    #resolutionU;
    #curvatureE;
    #curvatureU;
    #rotationY = 0;

    #top;
    #base;

    /**
     * Creates a Receiver object
     * @param {Number} [apiID=null] The id for api usage
     * @param {String} receiverName the name of the receiver
     * @param {THREE.Vector3} position Is the position of the receiver
     * @param {Number} rotationY the rotation Y of the receiver
     * @param {THREE.Vector3} normalVector the normal vector of the receiver
     * @param {String} towerType the type of the tower
     * @param {Number} planeE the plane E of the receiver
     * @param {Number} planeU the plane U of the receiver
     * @param {Number} resolutionE the resolution E of the receiver
     * @param {Number} resolutionU the resolution U of the receiver
     * @param {Number} curvatureE the curvature E of the receiver
     * @param {Number} curvatureU the curvature U of the receiver
     */
    constructor(
        receiverName,
        position,
        rotationY,
        normalVector,
        towerType,
        planeE,
        planeU,
        resolutionE,
        resolutionU,
        curvatureE,
        curvatureU,
        apiID = null
    ) {
        super(receiverName);
        // place the 3D object
        this.#base = new ReceiverBase();
        this.#base.position.copy(new THREE.Vector3(position.x, 0, position.z));
        this.add(this.#base);

        this.#top = new ReceiverTop();
        this.#top.position.copy(position);
        this.add(this.#top);

        this.rotateY(rotationY);
        this.#apiID = apiID;
        this.#towerType = towerType;
        this.#normalVector = normalVector;
        this.#planeE = planeE;
        this.#planeU = planeU;
        this.#resolutionE = resolutionE;
        this.#resolutionU = resolutionU;
        this.#curvatureE = curvatureE;
        this.#curvatureU = curvatureU;
        this.#rotationY = rotationY;
    }

    /**
     * Updates the receiver’s position by adjusting both the base and the top, ensuring that the base remains on the ground.
     * @param {THREE.Vector3} position the new position of the receiver
     */
    updatePosition(position) {
        this.#base.position.set(position.x, 0, position.z);
        this.#top.position.set(position.x, position.y, position.z);
    }

    getPosition() {
        return this.#top.position;
    }

    get apiID() {
        return this.#apiID;
    }

    set apiID(value) {
        this.#apiID = value;
    }

    get towerType() {
        return this.#towerType;
    }

    set towerType(value) {
        this.#towerType = value;
    }

    get normalVector() {
        return this.#normalVector;
    }

    set normalVector(value) {
        this.#normalVector = value;
    }

    get planeE() {
        return this.#planeE;
    }

    set planeE(value) {
        this.#planeE = value;
    }

    get planeU() {
        return this.#planeU;
    }

    set planeU(value) {
        this.#planeU = value;
    }

    get resolutionE() {
        return this.#resolutionE;
    }

    set resolutionE(value) {
        this.#resolutionE = value;
    }

    get resolutionU() {
        return this.#resolutionU;
    }

    set resolutionU(value) {
        this.#resolutionU = value;
    }

    get curvatureE() {
        return this.#curvatureE;
    }

    set curvatureE(value) {
        this.#curvatureE = value;
    }

    get curvatureU() {
        return this.#curvatureU;
    }

    set curvatureU(value) {
        this.#curvatureU = value;
    }

    get rotationY() {
        return this.#rotationY;
    }

    set rotationY(rotation) {
        this.#rotationY = rotation;
        this.#base.rotation.y = rotation;
        this.#top.rotation.y = rotation;
    }
}

/**
 * Class that builds the base of the receiver
 */
export class ReceiverBase extends Object3D {
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.loader.load("/static/models/towerBase.glb", (gltf) => {
            this.base = gltf.scene;
            this.add(this.base);
            this.base.traverse((child) => {
                if (child.type == "Mesh") {
                    child.castShadow = true;
                }
            });
        });
    }
}

/**
 * Class that builds the top of the receiver
 */
export class ReceiverTop extends Object3D {
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.loader.load("/static/models/towerTop.glb", (gltf) => {
            this.top = gltf.scene;
            this.add(this.top);
            this.top.traverse((child) => {
                if (child.type == "Mesh") {
                    child.castShadow = true;
                }
            });
        });
    }
}

/**
 * Class that represents the light source object
 */
export class LightSource extends SelectableObject {
    #apiID;
    #numberOfRays;
    #lightSourceType;
    #distributionType;
    #distributionMean;
    #distributionCovariance;

    /**
     * @param {Number} [apiID=null] the id for api usage
     * @param {String} lightsourceName the name of the lightsource
     * @param {Number} numberOfRays the number of rays the light source has
     * @param {String} lightSourceType the type of the light source
     * @param {String} distributionType the type of the distribution
     * @param {Number} distributionMean the mean of the distribution
     * @param {Number} distributionCovariance the covariance of the distribution
     */
    constructor(
        lightsourceName,
        numberOfRays,
        lightSourceType,
        distributionType,
        distributionMean,
        distributionCovariance,
        apiID = null
    ) {
        super(lightsourceName);
        this.#apiID = apiID;
        this.#numberOfRays = numberOfRays;
        this.#lightSourceType = lightSourceType;
        this.#distributionType = distributionType;
        this.#distributionMean = distributionMean;
        this.#distributionCovariance = distributionCovariance;
    }

    get apiID() {
        return this.#apiID;
    }

    set apiID(id) {
        this.#apiID = id;
    }

    get numberOfRays() {
        return this.#numberOfRays;
    }

    set numberOfRays(number) {
        this.#numberOfRays = number;
    }

    get lightSourceType() {
        return this.#lightSourceType;
    }

    set lightSourceType(type) {
        this.#lightSourceType = type;
    }

    get distributionType() {
        return this.#distributionType;
    }

    set distributionType(type) {
        this.#distributionType = type;
    }

    get distributionMean() {
        return this.#distributionMean;
    }

    set distributionMean(number) {
        this.#distributionMean = number;
    }

    get distributionCovariance() {
        return this.#distributionCovariance;
    }

    set distributionCovariance(number) {
        this.#distributionCovariance = number;
    }
}

/**
 * Creates the terrain for the scene
 */
export class Terrain extends Object3D {
    /**
     * Creates a new terrain.
     * @param {Number} size the size of the terrain.
     */
    constructor(size) {
        super();

        this.terrain = new THREE.Mesh(
            new THREE.CircleGeometry(size / 2),
            new THREE.MeshStandardMaterial({
                color: 0x5fd159,
            })
        );
        this.terrain.receiveShadow = true;
        this.terrain.rotateX((3 * Math.PI) / 2);
        this.add(this.terrain);

        this.mountains = new THREE.Group();
        this.add(this.mountains);
        for (let i = 0; i < 100; i++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(THREE.MathUtils.randFloat(20, 100)),
                new THREE.MeshStandardMaterial({
                    color: 0x50ba78,
                })
            );
            sphere.position.set(
                (size / 2) * Math.sin((i / 100) * 2 * Math.PI),
                0,
                (size / 2) * Math.cos((i / 100) * 2 * Math.PI)
            );
            this.mountains.add(sphere);
        }
    }
}
