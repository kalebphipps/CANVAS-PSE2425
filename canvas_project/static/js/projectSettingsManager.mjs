import { Editor } from "editor";

export class ProjectSettingsManager {
    #shadowEnabled;
    #fogEnabled;

    constructor() {
        this.editor = new Editor();
    }
}
