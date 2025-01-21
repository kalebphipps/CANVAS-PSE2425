import { TransformControls } from "THREE.transformControls";
import { Editor } from "./editor.mjs";

export class ModeSelector {
    /** @type {THREE.TransformControls} */
    #transformControls;
    /** @type {Editor} */
    #editor;
    /** @type {string} */
    #picker;
    #currentMode;
    #translationButton;
    #moveButton;
    #rotateButton;

    /**
     *
     * @param {THREE.TransformControls} transformControls
     */
    constructor(transformControls, picker) {
        this.#transformControls = transformControls;
        this.#picker = picker;
        this.#editor = Editor.getInstance();
        this.#currentMode = "translate";

        this.#translationButton = document.getElementById("home-tab2");
        this.#moveButton = document.getElementById("profile-tab2");
        this.#rotateButton = document.getElementById("profile-tab3");

        this.addEventListeners();
    }

    /**
     * add event listeners to the buttons
     */
    addEventListeners() {
        this.#translationButton.addEventListener("click", () => {
            this.setCurrentMode("translate");
            this.#picker.setMode("translate");
        });

        this.#moveButton.addEventListener("click", () => {
            this.setCurrentMode("move");
            this.#transformControls.setMode("translate");
        });

        this.#rotateButton.addEventListener("click", () => {
            this.setCurrentMode("rotate");
            this.#transformControls.setMode("rotate");
        });
    }

    /**
     * set the current mode
     * @param {string} mode
     */
    setCurrentMode(mode) {
        this.#currentMode = mode;
    }
}
