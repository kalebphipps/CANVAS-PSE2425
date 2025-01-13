import * as THREE from "three";
import { Object3D } from "three";

export class Receiver extends Object3D {
  /**
   *
   * @param {number} apiID the api id of the receiver to identify it
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
    apiID,
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
    this.apiID = apiID;
    this.towerType = towerType;
    this.normalVector = normalVector;
    this.planeE = planeE;
    this.planeU = planeU;
    this.resolutionE = resolutionE;
    this.resolutionU = resolutionU;
    this.curvatureE = curvatureE;
    this.curvatureU = curvatureU;
  }

  get apiID() {
    return this._apiID;
  }

  set apiID(value) {
    this._apiID = value;
  }

  get towerType() {
    return this._towerType;
  }

  set towerType(value) {
    this._towerType = value;
  }

  get normalVector() {
    return this._normalVector;
  }

  set normalVector(value) {
    this._normalVector = value;
  }

  get planeE() {
    return this._planeE;
  }

  set planeE(value) {
    this._planeE = value;
  }

  get planeU() {
    return this._planeU;
  }

  set planeU(value) {
    this._planeU = value;
  }

  get resolutionE() {
    return this._resolutionE;
  }

  set resolutionE(value) {
    this._resolutionE = value;
  }

  get resolutionU() {
    return this._resolutionU;
  }

  set resolutionU(value) {
    this._resolutionU = value;
  }

  get curvatureE() {
    return this._curvatureE;
  }

  set curvatureE(value) {
    this._curvatureE = value;
  }

  get curvatureU() {
    return this._curvatureU;
  }

  set curvatureU(value) {
    this._curvatureU = value;
  }
  /**
   *
   * @param {THREE.Vector3} position the new position of the receiver
   */
  updatePosition(position) {
    this.position.set(position.x, position.y, position.z);
  }
}
