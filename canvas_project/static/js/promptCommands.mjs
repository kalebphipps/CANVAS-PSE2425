import { Modal } from "bootstrap";

/**
 * Parent class of all prompt commands
 */
export class PromptCommand extends HTMLElement {
    #commandName;
    #occurenceLength = null;
    /**
     * @type {Number[]}
     */
    #selectedChars = null;
    #commandElem;
    /**
     * Creates a new prompt command
     * @param {String} name the name of the command
     * @param {String} [keybind=null] the keybind of the command
     */
    constructor(name, keybind = null) {
        super();
        this.#commandName = name;
        this.classList.add(
            "rounded-2",
            "p-1",
            "px-2",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );

        this.#commandElem = document.createElement("div");
        this.#commandElem.innerHTML = name;
        this.appendChild(this.#commandElem);

        if (keybind) {
            const keybindElem = document.createElement("div");
            keybindElem.innerHTML = keybind;
            keybindElem.classList.add("key", "border", "p-0", "px-2");
            this.appendChild(keybindElem);
        }
    }

    get commandName() {
        return this.#commandName;
    }

    get occurenceLength() {
        return this.#occurenceLength;
    }

    set occurenceLength(length) {
        this.#occurenceLength = length;
    }

    /**
     * @param {Number[]} chars is an array of char indexes you want to be selected
     */
    set selectedChars(chars) {
        this.#selectedChars = chars;
        if (this.#selectedChars !== null) {
            if (this.#selectedChars.length > 1) {
                this.#occurenceLength =
                    this.#selectedChars[this.#selectedChars.length - 1] -
                    this.#selectedChars[0];
            } else {
                this.#occurenceLength = 0;
            }
        }
    }

    /**
     * Makes all the characters specified by 'selectedChars' bold.
     */
    formatCommandName() {
        if (this.#selectedChars) {
            let formattedName = "";
            let lastIndex = 0;
            this.#selectedChars.forEach((index) => {
                formattedName += this.#commandName.slice(lastIndex, index);
                formattedName += `<b>${this.#commandName[index]}</b>`;
                lastIndex = index + 1;
            });
            formattedName += this.#commandName.slice(lastIndex);
            this.#commandElem.innerHTML = formattedName;
        } else {
            this.#commandElem.innerHTML = this.#commandName;
        }
    }

    select() {
        this.classList.add("bg-primary");
    }

    unselect() {
        this.classList.remove("bg-primary");
    }

    /**
     * Executes the prompt command.
     */
    execute() {
        throw new Error(
            "This method needs to be implemented in all subclasses"
        );
    }
}

/**
 * Prompt command to enable light mode
 */
export class LightModePromptCommand extends PromptCommand {
    #themeSwitcher;
    constructor() {
        super("Use light mode");
        this.#themeSwitcher = document.getElementById("mode-toggle");
    }

    execute() {
        document.documentElement.setAttribute("data-bs-theme", "light");
        localStorage.setItem("theme", "light");
        this.#themeSwitcher.innerHTML =
            "<i class='bi bi-brightness-high'></i> light";
    }
}

/**
 * Prompt command to enable dark mode
 */
export class DarkModePromptCommand extends PromptCommand {
    #themeSwitcher;
    constructor() {
        super("Use dark mode");
        this.#themeSwitcher = document.getElementById("mode-toggle");
    }

    execute() {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        localStorage.setItem("theme", "dark");
        this.#themeSwitcher.innerHTML = "<i class='bi bi-moon-stars'></i> dark";
    }
}

/**
 * Prompt command to enable auto mode
 */
export class AutoModePromptCommand extends PromptCommand {
    #themeSwitcher;
    constructor() {
        super("Use auto mode");
        this.#themeSwitcher = document.getElementById("mode-toggle");
    }

    execute() {
        document.documentElement.setAttribute(
            "data-bs-theme",
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        );
        localStorage.setItem("theme", "auto");
        this.#themeSwitcher.innerHTML =
            "<i class='bi bi-circle-half'></i> auto";
    }
}

/**
 * Prompt command to add a heliostat to the scene
 */
export class AddHeliostatPromptCommand extends PromptCommand {
    constructor() {
        super("Add heliostat");
    }

    execute() {
        console.log("heliostat");
    }
}

/**
 * Prompt command to add a receiver to the scene
 */
export class AddReceiverPromptCommand extends PromptCommand {
    constructor() {
        super("Add receiver");
    }

    execute() {
        console.log("receiver");
    }
}

/**
 * Prompt command to add a lightsource to the scene
 */
export class AddLightSourcePromptCommand extends PromptCommand {
    constructor() {
        super("Add light source");
    }

    execute() {
        console.log("light source");
    }
}

/**
 * Prompt command to toggle fullscreen
 */
export class ToggleFullscreenPromptCommand extends PromptCommand {
    constructor() {
        super("Toggle fullscreen", "F11");
    }

    execute() {
        console.log("toggle fullscreen");
    }
}

/**
 * Prompt command to export the current project
 */
export class ExportProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Export project");
    }

    execute() {
        window.location.href = window.location + "/hdf5";
    }
}

/**
 * Prompt command to render the current project
 */
export class RenderProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Render project");
    }

    execute() {
        console.log("render");
    }
}

/**
 * Prompt command to open the settings pane
 */
export class OpenSettingsPromptCommand extends PromptCommand {
    constructor() {
        super("Open settings");
    }

    execute() {
        const settingsModal = new Modal(document.getElementById("settings"));
        settingsModal.show();
    }
}

/**
 * Prompt command to open the job interface pane
 */
export class OpenJobInterfacePromptCommand extends PromptCommand {
    constructor() {
        super("Open job interface");
    }

    execute() {
        const jobInterfaceModal = new Modal(
            document.getElementById("jobInterface")
        );
        jobInterfaceModal.show();
    }
}

/**
 * Prompt command to open the keybindings help page
 */
export class OpenKeybindsPromptCommand extends PromptCommand {
    constructor() {
        super("Open keybindings help page");
    }

    execute() {
        const keybindingsModal = new Modal(
            document.getElementById("keyboardModal")
        );
        keybindingsModal.show();
    }
}

/**
 * Prompt command to logout the user
 */
export class LogoutPromptCommand extends PromptCommand {
    constructor() {
        super("Logout");
    }

    execute() {
        fetch(window.location.origin + "/logout", {
            method: "POST",
        });
    }
}

/**
 * Prompt command to create a new project
 */
export class NewProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Create new project");
    }

    execute() {
        const newProjectModal = new Modal(
            document.getElementById("createNewProject")
        );
        newProjectModal.show();

        document
            .getElementById("createNewProject")
            .addEventListener("shown.bs.modal", function () {
                document.getElementById("createProjectNameInput").focus();
            });
    }
}

/**
 * Prompt command to open an existing project
 */
export class OpenProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Open exisiting project");
    }

    execute() {
        const newProjectModal = new Modal(
            document.getElementById("openProject")
        );
        newProjectModal.show();
    }
}

// define the new HTML elements
customElements.define("light-mode-prompt-command", LightModePromptCommand);
customElements.define("dark-mode-prompt-command", DarkModePromptCommand);
customElements.define("auto-mode-prompt-command", AutoModePromptCommand);
customElements.define(
    "add-heliostat-prompt-command",
    AddHeliostatPromptCommand
),
    customElements.define(
        "add-receiver-prompt-command",
        AddReceiverPromptCommand
    );
customElements.define(
    "add-light-source-prompt-command",
    AddLightSourcePromptCommand
);
customElements.define(
    "toggle-fullscreen-prompt-command",
    ToggleFullscreenPromptCommand
);
customElements.define(
    "export-project-prompt-command",
    ExportProjectPromptCommand
);
customElements.define(
    "render-project-prompt-command",
    RenderProjectPromptCommand
);
customElements.define(
    "open-settings-prompt-command",
    OpenSettingsPromptCommand
);
customElements.define(
    "open-job-interface-prompt-command",
    OpenJobInterfacePromptCommand
);
customElements.define(
    "open-keybings-prompt-command",
    OpenKeybindsPromptCommand
);
customElements.define("logout-prompt-command", LogoutPromptCommand);
customElements.define("new-project-prompt-command", NewProjectPromptCommand);
customElements.define("open-project-prompt-command", OpenProjectPromptCommand);
