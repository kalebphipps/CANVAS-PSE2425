import { Heliostat, Receiver, Lightsource } from "objects";
import { Vector2 } from "three";

/**
 * Handles saving and loading projects inside of CANVAS
 */
export class SaveAndLoadHandler {
  #base_api_url;
  /**
   * Creates a new handler
   * @param {Number} project_id - The id of the project
   */
  constructor(project_id) {
    this.project_id = project_id;
    this.#base_api_url = window.location.origin + "/api/";
  }

  /**
   * Returns a Json representation of the project defined by the project_id
   * @returns {Promise<JSON>} - A JSON representation of the project
   */
  async getProjectData() {
    const url = this.base_api_url + "projects/" + this.project_id;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error.message);
    }
  }

  // Object creation
  /**
   * Creates a databank entry for the given heliostat
   * @param {Heliostat} heliostat - Is the heliostat you want an entry for
   */
  async createHeliostat(heliostat) {}

  /**
   * Creates a databank entry for the given receiver
   * @param {Receiver} receiver - Is the receiver you want an entry for
   */
  async createReceiver(receiver) {}

  /**
   * Creates a databank entry for the given lightsource
   * @param {Lightsource} lightsource - Is the lightsource you want an entry for
   */
  async createLightsource(lightsource) {}

  // Object deletion
  /**
   * Deletes the given heliostat from the backend
   * @param {Heliostat} heliostat - Is the heliostat you want to delete
   */
  async deleteHeliostat(heliostat) {}

  // Object deletion
  /**
   * Deletes the given receiver from the backend
   * @param {Receiver} receiver - Is the receiver you want to delete
   */
  async deleteReceiver(receiver) {}

  // Object deletion
  /**
   * Deletes the given lightsource from the backend
   * @param {Lightsource} lightsource - Is the lightsource you want to delete
   */
  async deleteLightsource(lightsource) {}

  // Object updating
  /**
   * Updates the given heliostat in the backend
   * @param {Heliostat} heliostat - Is the updated heliostat from the frontend
   */
  async updateHeliostat(heliostat) {}

  /**
   * Updates the given receiver in the backend
   * @param {Receiver} receiver - Is the updated receiver from the frontend
   */
  async updateReceiver(receiver) {}

  /**
   * Updates the given lightsource in the backend
   * @param {Lightsource} lightsource - Is the updated lightsource from the frontend
   */
  async updateLightsource(lightsource) {}

  // Settings updating
  /**
   * Updates the settings accroding to the given changes
   * @param {String[]} change - A key value pair to specify the settings change.
   */
  async updateSettings(change) {}
}
