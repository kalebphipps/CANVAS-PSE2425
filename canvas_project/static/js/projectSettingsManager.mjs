import { Editor } from "editor";
import { SaveAndLoadHandler } from "saveAndLoadHandler";

export class ProjectSettingsManager {
    #environmentSettingsEntry;
    #graphicsSettingsEntry;
    #otherSettingsEntry;

    #shadowEnabled;
    #fogEnabled;
    #editor;
    #saveAndLoadHandler;

    /**
     * Constructor for the project settings manager
     */
    constructor() {
        this.#editor = new Editor();
        this.#saveAndLoadHandler = new SaveAndLoadHandler();
        this.initialize();
    }

    /**
     * Method to initialize the project settings manager
     */
    async initialize() {
        await this.#getPresets();

        this.#environmentSettingsEntry = document.getElementById(
            "enviroment-settings"
        );

        this.#graphicsSettingsEntry =
            document.getElementById("graphic-settings");

        this.#otherSettingsEntry = document.getElementById("other-settings");

        //render the graphics settings
        this.#renderUISettings();

        this.#environmentSettingsEntry.textContent = "No settings available";
        this.#otherSettingsEntry.textContent = "No settings available";
    }

    /**
     * Method to get the presets for shadows and fog from the project settings
     */
    async #getPresets() {
        const projectJson = await this.#saveAndLoadHandler.getProjectData();

        const settingsList = projectJson["settings"];
        this.#shadowEnabled = settingsList["shadows"];
        this.#fogEnabled = settingsList["fog"];
    }

    /**
     * Method to render the graphics settings
     */
    #renderUISettings() {
        this.#graphicsSettingsEntry.innerHTML = "";

        //checkbox for shadows
        const shadowCheckbox = this.#createCheckbox(
            "Shadow",
            this.#shadowEnabled,
            (isChecked) => {
                this.#shadowEnabled = isChecked;
                this.#editor.setShadows(isChecked);
                this.#saveAndLoadHandler.updateSettings(
                    "shadow",
                    this.#shadowEnabled
                );
            }
        );

        //checkbox for fog
        const fogCheckbox = this.#createCheckbox(
            "Fog",
            this.#fogEnabled,
            (isChecked) => {
                this.#fogEnabled = isChecked;
                this.#editor.setFog(isChecked);
                this.#saveAndLoadHandler.updateSettings(
                    "fog",
                    this.#fogEnabled
                );
            }
        );

        this.#graphicsSettingsEntry.appendChild(shadowCheckbox);
        this.#graphicsSettingsEntry.appendChild(fogCheckbox);
    }

    /**
     * Method to create a checkbox
     * @param {string} label
     * @param {boolean} isChecked
     * @param {*} onChange
     * @returns {HTMLDivElement} Wrapper for the checkbox
     */
    #createCheckbox(label, isChecked, onChange) {
        //Wrapper for the checkbox
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-check", "mb-2");

        //create the checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input");
        checkbox.checked = isChecked;

        //label for the checkbox
        const checkboxLabel = document.createElement("label");
        checkboxLabel.classList.add("form-check-label");
        checkboxLabel.textContent = label;

        //Event listener for changes in the checkbox
        checkbox.addEventListener("change", () => {
            onChange(checkbox.checked);
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(checkboxLabel);
        return wrapper;
    }
}
