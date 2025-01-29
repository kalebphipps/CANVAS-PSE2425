import { Modal } from "bootstrap";

export class CommandPrompt {
    /**
     * @type {HTMLInputElement}
     */
    #commandInput;
    #commandListElem;
    /**
     * @type {PromptCommand[]}
     */
    #commandList = [];
    /**
     * @type {PromptCommand[]}
     */
    #currentlyAvailabeCommands = [];
    #modal;
    #selectedIndex = 0;
    /**
     * @type {PromptCommand}
     */
    #selectedCommand;

    constructor() {
        this.#commandListElem = document.getElementById("commandList");
        this.#modal = new Modal(document.getElementById("commandPrompt"));

        this.#createInputField();

        // open and close the command prompt
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "p") {
                event.preventDefault();
                this.#modal.toggle();
                if (
                    document
                        .getElementById("commandPrompt")
                        .classList.contains("show")
                ) {
                    this.#initializeCommandPrompt();
                }
            }
        });

        // handle command selection
        document.addEventListener("keydown", (event) => {
            if (
                document
                    .getElementById("commandPrompt")
                    .classList.contains("show")
            ) {
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    this.#selectedIndex =
                        (this.#selectedIndex -
                            1 +
                            this.#commandListElem.children.length) %
                        this.#commandListElem.children.length;
                    this.#selectCommand();
                }
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    this.#selectedIndex =
                        (this.#selectedIndex + 1) %
                        this.#commandListElem.children.length;
                    this.#selectCommand();
                }

                if (event.key === "Enter") {
                    this.#selectedCommand.execute();
                }
            }
        });

        // handle user input
        this.#commandInput.addEventListener("input", () => {
            this.#updateCommandPrompt();
        });

        this.#commandList = [
            new LightModePromptCommand(),
            new DarkModePromptCommand(),
            new AddHeliostatPromptCommand(),
            new AddReceiverPromptCommand(),
            new AddLightSourcePromptCommand(),
            new ToggleFullscreenPromptCommand(),
        ];
    }
    #createInputField() {
        this.#commandInput = document.createElement("input");
        this.#commandInput.classList.add(
            "form-control",
            "border-0",
            "shadow-none"
        );
        this.#commandInput.placeholder = "Select a command";
        document.getElementById("commandInput").appendChild(this.#commandInput);
    }

    #initializeCommandPrompt() {
        this.#commandList.forEach((command) => {
            this.#commandListElem.appendChild(command);
        });

        this.#selectedIndex = 0;
        this.#selectCommand();
        this.#commandInput.value = "";
        this.#commandInput.focus();
    }

    #selectCommand() {
        if (this.#selectedCommand) {
            this.#selectedCommand.classList.remove("text-white");
            this.#selectedCommand.unselect();
        }
        this.#selectedCommand =
            this.#commandListElem.children[this.#selectedIndex];
        this.#selectedCommand.select();
        this.#selectedCommand.classList.add("text-white");
        this.#selectedCommand.scrollIntoView({ block: "nearest" });
    }

    #updateCommandPrompt() {
        this.#selectedIndex = 0;
        this.#selectCommand();

        // calculate the new available commands
        // via Levenshtein-Distanz
        console.log("updatedCommands");
    }
}

class PromptCommand extends HTMLElement {
    #commandName;
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

        const commandName = document.createElement("div");
        commandName.innerHTML = name;
        this.appendChild(commandName);

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

class LightModePromptCommand extends PromptCommand {
    constructor() {
        super("Use light mode");
    }

    execute() {
        console.log("light mode");
    }
}

class DarkModePromptCommand extends PromptCommand {
    constructor() {
        super("Use dark mode");
    }

    execute() {}
}

class AddHeliostatPromptCommand extends PromptCommand {
    constructor() {
        super("Add heliostat");
    }

    execute() {
        console.log("heliostat");
    }
}

class AddReceiverPromptCommand extends PromptCommand {
    constructor() {
        super("Add receiver");
    }

    execute() {
        console.log("receiver");
    }
}

class AddLightSourcePromptCommand extends PromptCommand {
    constructor() {
        super("Add light source");
    }

    execute() {
        console.log("light source");
    }
}

class ToggleFullscreenPromptCommand extends PromptCommand {
    constructor() {
        super("Toggle fullscreen");
    }

    execute() {
        console.log("toggle fullscreen");
    }
}

customElements.define("light-mode-prompt-command", LightModePromptCommand);
customElements.define("dark-mode-prompt-command", DarkModePromptCommand);
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
