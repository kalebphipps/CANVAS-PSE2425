import { Editor } from "editor";
import { SaveAndLoadHandler } from "saveAndLoadHandler";

export class ProjectSettingsManager {
    #graphicsSettingsButton;
    #graphicsSettingsEntry;
    #shadowCheckbox;
    #fogCheckbox;
    #shadowEnabled;
    #fogEnabled;
    #editor;

    constructor() {
        console.log("ProjectSettingsManager constructor");
        this.#editor = new Editor();
        this.#graphicsSettingsButton = document.getElementById(
            "graphic-settings-button"
        );
        this.#graphicsSettingsEntry =
            document.getElementById("graphic-settings");
        //how do I get this from the editor??
        this.#shadowEnabled = this.#editor.shadowEnabled;
        this.#fogEnabled = this.#editor.fogEnabled;

        this.#graphicsSettingsButton.addEventListener("click", () => {
            console.log("Button clicked, rendering...");
            this.#render();
        });
    }

    #render() {
        this.#graphicsSettingsEntry.innerHTML = "";

        //checkbox for shadows
        const shadowCheckbox = this.#createCheckbox(
            "Shadow",
            this.#shadowEnabled,
            (isChecked) => {
                this.#shadowEnabled = isChecked;
                this.#editor.setShadows(isChecked);
            }
        );

        //checkbox for fog
        const fogCheckbox = this.#createCheckbox(
            "Fog",
            this.#fogEnabled,
            (isChecked) => {
                this.#fogEnabled = isChecked;
                this.#editor.setFog(isChecked);
            }
        );

        this.#graphicsSettingsEntry.appendChild(shadowCheckbox);
        this.#graphicsSettingsEntry.appendChild(fogCheckbox);
    }

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
        checkbox.addEventListener("change", (event) => {
            onChange(event.target.checked);
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(checkboxLabel);
        return wrapper;
    }
}
