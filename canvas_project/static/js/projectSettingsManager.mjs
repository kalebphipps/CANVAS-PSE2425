import { Editor } from "editor";

export class ProjectSettingsManager {
    #shadowEnabled;
    #fogEnabled;

    constructor() {
        this.editor = new Editor();
        this.#shadowEnabled = false;
        this.#fogEnabled = false;
    }

    toggleShadow(mode) {
        this.#shadowEnabled = mode;
        this.editor.setShadows(this.#shadowEnabled);
    }

    toggleFog(mode) {
        this.#fogEnabled = mode;
        this.editor.setFog(this.#fogEnabled);
    }
}
