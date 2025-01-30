import { Modal } from "bootstrap";

export class PromptCommand extends HTMLElement {
    #commandName;
    #occurenceLength = null;
    /**
     * @type {Number[]}
     */
    #selectedChars = null;
    #commandElem;
    /**
     *
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
            keybindElem.classList.add("key", "border", "p-1", "px-2");
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

    execute() {
        throw new Error(
            "This method needs to be implemented in all subclasses"
        );
    }
}

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

export class AddHeliostatPromptCommand extends PromptCommand {
    constructor() {
        super("Add heliostat");
    }

    execute() {
        console.log("heliostat");
    }
}

export class AddReceiverPromptCommand extends PromptCommand {
    constructor() {
        super("Add receiver");
    }

    execute() {
        console.log("receiver");
    }
}

export class AddLightSourcePromptCommand extends PromptCommand {
    constructor() {
        super("Add light source");
    }

    execute() {
        console.log("light source");
    }
}

export class ToggleFullscreenPromptCommand extends PromptCommand {
    constructor() {
        super("Toggle fullscreen");
    }

    execute() {
        console.log("toggle fullscreen");
    }
}

export class ExportProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Export project");
    }

    execute() {
        console.log("export");
    }
}

export class RenderProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Render project");
    }

    execute() {
        console.log("render");
    }
}

export class OpenSettingsPromptCommand extends PromptCommand {
    constructor() {
        super("Open settings");
    }

    execute() {
        const settingsModal = new Modal(document.getElementById("settings"));
        settingsModal.show();
    }
}

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
