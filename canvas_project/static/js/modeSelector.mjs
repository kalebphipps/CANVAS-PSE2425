import { TransformControls } from "THREE.transformControls";
import { Editor } from "./editor.mjs";

export class ModeSelector {
    /** @type {THREE.TransformControls} */
    #transformControls;
    /** @type {Editor} */
    #editor;
    /** @type {string} */
    #currentMode;
    #translationButton;
    #moveButton;
    #rotateButton;

    /**
     *
     * @param {THREE.TransformControls} transformControls
     */
    constructor(transformControls) {
        this.#transformControls = transformControls;
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
            this.#transformControls.setMode("translate");
            this.#transformControls.detach();
            this.#editor.orbitControls.enabled = true;
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

    /**
     * get the current mode
     * @returns the current mode
     */
    getCurrentMode() {
        return this.#currentMode;
    }
}
