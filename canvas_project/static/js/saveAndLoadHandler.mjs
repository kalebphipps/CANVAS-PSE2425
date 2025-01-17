import { Heliostat, Receiver, LightSource } from "objects";

let saveAndLoadHandlerInstance = null;

/**
 * Provides a wrapper for the API
 *
 * Contains a methods for every databank manipulation needed.
 */
export class SaveAndLoadHandler {
    #projectID;
    #baseAPIUrl;

    /**
     * Creates a saveAndLoadHandler
     * @param {Number} projectId the projectID for api requests.
     * @returns a new saveAndLoadHandler instance or the existing one.
     */
    constructor(projectId) {
        if (saveAndLoadHandlerInstance) {
            return saveAndLoadHandlerInstance;
        }
        saveAndLoadHandlerInstance = this;

        this.#projectID = projectId;
        this.#baseAPIUrl = window.location.origin + "/api/";
    }

    /**
     * Returns a Json representation of the project defined by the project_id
     * @returns {Promise<JSON>} - A JSON representation of the project
     */
    async getProjectData() {
        const url = this.#baseAPIUrl + "projects/" + this.#projectID;
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => console.log(error.message));
    }

    /**
     * Creates a databank entry for the given heliostat
     * @param {Heliostat} heliostat - Is the heliostat you want an entry for
     */
    async createHeliostat(heliostat) {
        const url =
            this.#baseAPIUrl + "projects/" + this.#projectID + "/heliostats/";

        const body = {
            name: "",
            position_x: heliostat.position.x,
            position_y: heliostat.position.y,
            position_z: heliostat.position.z,
            aimpoint_x: heliostat.aimPoint.x,
            aimpoint_y: heliostat.aimPoint.y,
            aimpoint_z: heliostat.aimPoint.z,
            number_of_facets: heliostat.numberOfFacets,
            kinematic_type: heliostat.kinematicType,
        };

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.#getCookie("csrftoken"),
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => console.log(error.message));
    }

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
     * @param {String} attribute the attribute you want to change
     * @param {any} newValue the new value of the attribute
     */
    async updateSettings(attribute, newValue) {}

    /**
     * Gets the cookie specified by the name
     * @param {String} name The name of the cookie you want to get.
     * @returns the cookie or null if it couldn't be found.
     */
    #getCookie(name) {
        if (!document.cookie) {
            return null;
        }

        // document.cookie is a key=value list separated by ';'
        const xsrfCookies = document.cookie
            .split(";")
            .map((c) => c.trim())
            //filter the right cookie name
            .filter((c) => c.startsWith(name + "="));

        if (xsrfCookies.length === 0) {
            return null;
        }
        // return the decoded value of the first cookie found
        return decodeURIComponent(xsrfCookies[0].split("=")[1]);
    }
}
