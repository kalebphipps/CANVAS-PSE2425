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
            if (event.ctrlKey && event.key.toLowerCase() === "p") {
                event.preventDefault();
                this.#modal.toggle();
                if (
                    document
                        .getElementById("commandPrompt")
                        .classList.contains("show")
                ) {
                    this.#commandInput.value = "";
                    this.#commandListElem.innerHTML = "";
                    this.#commandInput.focus();
                    this.#commandList.forEach((command) => {
                        this.#commandListElem.appendChild(command);
                    });
                    this.#selectedIndex = 0;
                    this.#selectCommand();
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
                    this.#modal.hide();
                    if (this.#selectedCommand) {
                        this.#selectedCommand.execute();
                    }
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
            new AutoModePromptCommand(),
            new AddHeliostatPromptCommand(),
            new AddReceiverPromptCommand(),
            new AddLightSourcePromptCommand(),
            new ToggleFullscreenPromptCommand(),
            new ExportProjectPromptCommand(),
            new RenderProjectPromptCommand(),
            new OpenSettingsPromptCommand(),
            new OpenJobInterfacePromptCommand(),
        ];

        this.#commandList.sort((command1, command2) =>
            command1.commandName.localeCompare(command2.commandName)
        );
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
        this.#commandInput.focus();
        this.#currentlyAvailabeCommands = [];
        this.#commandListElem.innerHTML = "";

        if (this.#commandInput.value.length == 0) {
            this.#commandList.forEach((command) => {
                this.#commandListElem.appendChild(command);
            });
        } else {
            // calculate the new available commands
            this.#commandList.forEach((command) => {
                command.currentLevenshteinDistance =
                    this.#calculateLevenshteinDisctance(
                        this.#commandInput.value.toLowerCase(),
                        command.commandName.toLowerCase()
                    ) -
                    Math.abs(
                        command.commandName.length -
                            this.#commandInput.value.length
                    );

                if (command.currentLevenshteinDistance <= 2) {
                    this.#currentlyAvailabeCommands.push(command);
                }
            });

            // render new command selection
            this.#currentlyAvailabeCommands.forEach((command) => {
                this.#commandListElem.appendChild(command);
            });
        }

        if (this.#commandListElem.children.length > 0) {
            this.#selectedIndex = 0;
            this.#selectCommand();
        } else {
            if (this.#selectedCommand) {
                this.#selectedCommand.unselect();
                this.#selectedCommand = null;
            }
            const noCommands = document.createElement("i");
            noCommands.classList.add("text-secondary");
            noCommands.innerHTML = "No commands available";

            this.#commandListElem.appendChild(noCommands);
        }
    }

    /**
     * Calculates the amount of changes you have to perform to one word to get to the other one.
     * @param {String} word1 first word
     * @param {String} word2 second word
     * @link [Levenshtein distance](https://de.wikipedia.org/wiki/Levenshtein-Distanz#:~:text=Mathematisch%20ist%20die%20Levenshtein%2DDistanz,auf%20dem%20Raum%20der%20Symbolsequenzen.&text=In%20der%20Praxis%20wird%20die,oder%20bei%20der%20Duplikaterkennung%20angewandt.)
     */
    #calculateLevenshteinDisctance(word1, word2) {
        // initialize matrix
        const matrix = Array(word1.length + 1)
            .fill(null)
            .map(() => Array(word2.length + 1).fill(null));

        // initialize first line
        for (let i = 0; i <= word2.length; i++) {
            matrix[0][i] = i;
        }
        // initialize first column
        for (let j = 0; j <= word1.length; j++) {
            matrix[j][0] = j;
        }

        // backtrace
        for (let i = 1; i <= word1.length; i++) {
            for (let j = 1; j <= word2.length; j++)
                this.#backtraceLevenshtein(i, j, matrix, word1, word2);
        }

        return matrix[word1.length][word2.length];
    }

    /**
     * Calculates the given entry for the levenshtein matrix.
     * @param {Number} i the line index
     * @param {Number} j the column index
     * @param {Array<Array>} matrix the matrix used for the levenshtein distance
     * @param {String} word1 the first word
     * @param {String} word2 the second word
     */
    #backtraceLevenshtein(i, j, matrix, word1, word2) {
        let equal = Number.MAX_SAFE_INTEGER;

        if (word1.charAt(i - 1) === word2.charAt(j - 1)) {
            equal = matrix[i - 1][j - 1];
        }
        const replaced = matrix[i - 1][j - 1] + 1;
        const added = matrix[i][j - 1] + 1;
        const deleted = matrix[i - 1][j] + 1;
        matrix[i][j] = Math.min(equal, replaced, added, deleted);
    }
}

class PromptCommand extends HTMLElement {
    #commandName;
    #currentLevenshteinDistance = 0;
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

    get currentLevenshteinDistance() {
        return this.#currentLevenshteinDistance;
    }

    set currentLevenshteinDistance(distance) {
        this.#currentLevenshteinDistance = distance;
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

class DarkModePromptCommand extends PromptCommand {
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

class AutoModePromptCommand extends PromptCommand {
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

class ExportProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Export project");
    }

    execute() {
        console.log("export");
    }
}

class RenderProjectPromptCommand extends PromptCommand {
    constructor() {
        super("Render project");
    }

    execute() {
        console.log("render");
    }
}

class OpenSettingsPromptCommand extends PromptCommand {
    constructor() {
        super("Open settings");
    }

    execute() {
        const settingsModal = new Modal(document.getElementById("settings"));
        settingsModal.show();
    }
}

class OpenJobInterfacePromptCommand extends PromptCommand {
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
