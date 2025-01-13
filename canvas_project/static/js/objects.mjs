import * as THREE from "three";
import { Object3D } from "three";

/**
 *  Class that represents the Heliostat object
 */
export class Heliostat extends Object3D {
  #apiID;
  #aimPoint;
  #numberOfFacets;
  #kinematicType;

  /**
   *
   * @param {THREE.Vector3} aimPoint The Point the Heliostat is aiming at.
   * @param {Number} numberOfFacets Number of Facets the Heliostat has.
   * @param {String} kinematicType The type of kinematic the Heliostat has.
   */

  constructor(aimPoint, numberOfFacets, kinematicType) {
    super();
    this.#aimPoint = aimPoint;
    this.#numberOfFacets = numberOfFacets;
    this.#kinematicType = kinematicType;
  }
  /**
   * Updates the aimPoint of the Heliostat
   * @param {THREE.Vector3} aimPoint
   */
  updateAimPoint(aimPoint) {
    this.#aimPoint = aimPoint;
  }

  get apiID() {
    return this.#apiID;
  }

  set apiID(value) {
    this.#apiID = value;
  }

  getAimPoint() {
    return this.#aimPoint;
  }

  setAimPoint(aimPoint) {
    this.#aimPoint = aimPoint;
  }

  getNumberOfFacets() {
    return this.#numberOfFacets;
  }

  setNumberOfFacets(numberOfFacets) {
    this.#numberOfFacets = numberOfFacets;
  }

  getKinematicType() {
    return this.#kinematicType;
  }

  setKinematicType(kinematicType) {
    this.#kinematicType = kinematicType;
  }
}

/**
 * Class that represents the receiver object
 */
export class Receiver extends Object3D {
  #apiID;
  #towerType;
  #normalVector;
  #planeE;
  #planeU;
  #resolutionE;
  #resolutionU;
  #curvatureE;
  #curvatureU;

  /**
   *
   * @param {String} towerType the type of the tower
   * @param {THREE.Vector3} normalVector the normal vector of the receiver
   * @param {Number} planeE the plane E of the receiver
   * @param {Number} planeU the plane U of the receiver
   * @param {Number} resolutionE the resolution E of the receiver
   * @param {Number} resolutionU the resolution U of the receiver
   * @param {Number} curvatureE the curvature E of the receiver
   * @param {Number} curvatureU the curvature U of the receiver
   */
  constructor(
    towerType,
    normalVector,
    planeE,
    planeU,
    resolutionE,
    resolutionU,
    curvatureE,
    curvatureU
  ) {
    super();
    this.#apiID = apiID;
    this.#towerType = towerType;
    this.#normalVector = normalVector;
    this.#planeE = planeE;
    this.#planeU = planeU;
    this.#resolutionE = resolutionE;
    this.#resolutionU = resolutionU;
    this.#curvatureE = curvatureE;
    this.#curvatureU = curvatureU;
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
  /**
   *
   * @param {THREE.Vector3} position the new position of the receiver
   */
  updatePosition(position) {
    this.position.set(position.x, position.y, position.z);
  }
}

/**
 * Class that represents the light source object
 */
export class LightSource extends Object3D {
  #apiID;
  #numberOfRays;
  #lightSourceType;
  #distributionType;
  #distributionMean;
  #distributionCovariance;

  /**
   *
   * @param {Number} apiID the apiID of the light source
   * @param {Number} numberOfRays the number of rays the light source has
   * @param {String} lightSourceType the type of the light source
   * @param {String} distributionType the type of the distribution
   * @param {Number} distributionMean the mean of the distribution
   * @param {Number} distributionCovariance the covariance of the distribution
   */
  constructor(
    apiID,
    numberOfRays,
    lightSourceType,
    distributionType,
    distributionMean,
    distributionCovariance
  ) {
    super();
    this.#apiID = apiID;
    this.#numberOfRays = numberOfRays;
    this.#lightSourceType = lightSourceType;
    this.#distributionType = distributionType;
    this.#distributionMean = distributionMean;
    this.#distributionCovariance = distributionCovariance;
  }
}
