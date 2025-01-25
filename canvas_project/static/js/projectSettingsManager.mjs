import { Editor } from "editor";

export class ProjectSettingsManager {
    #graphicsButton;
    #shadowCheckbox;
    #fogCheckbox;
    #shadowEnabled;
    #fogEnabled;
    #editor;

    constructor() {
        this.#editor = new Editor();
        this.#graphicsButton = document.getElementById("graphic-settings");
        //how do I get this from the editor??
        this.#shadowEnabled = this.#editor.shadowEnabled;
        this.#fogEnabled = this.#editor.fogEnabled;

        this.#graphicsButton.addEventListener("click", () => {
            this.#render();
        });
    }

    #render() {
        this.#graphicsButton.innerHTML = "";

        //checkbox for shadows
        const shadowCheckbox = this.#createCheckbox(
            "Shadows",
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

        this.#graphicsButton.appendChild(shadowCheckbox);
        this.#graphicsButton.appendChild(fogCheckbox);
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
