/**
 * Handles saving and loading projects inside of CANVAS
 */
export class SaveAndLoadHandler {
  /**
   * Creates a new handler
   * @param {Number} project_id - The id of the project
   */
  constructor(project_id) {
    this.project_id = project_id;
    this.base_api_url = window.location.origin + "/api/";
  }

  /**
   * Returns a Json representation of the project defined by the project_id
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
  async createHeliostat() {}

  async createReceiver() {}

  async createLightsource() {}

  // Object deletion
  async deleteHeliostat(id) {}

  async deleteReceiver(id) {}

  async deleteLightsource(id) {}

  // Object updating
  async updateHeliostat(id, changes) {}

  async updateReceiver(id, changes) {}

  async updateLightsource(id, changes) {}

  // Settings updating
  async updateSettings(changes) {}
}
