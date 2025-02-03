import { Modal } from "bootstrap";
import {
    LightModePromptCommand,
    DarkModePromptCommand,
    AutoModePromptCommand,
    AddHeliostatPromptCommand,
    AddReceiverPromptCommand,
    AddLightSourcePromptCommand,
    ToggleFullscreenPromptCommand,
    ExportProjectPromptCommand,
    RenderProjectPromptCommand,
    OpenSettingsPromptCommand,
    OpenJobInterfacePromptCommand,
    PromptCommand,
    OpenKeybindsPromptCommand,
    LogoutPromptCommand,
    NewProjectPromptCommand,
    OpenProjectPromptCommand,
} from "promptCommands";

/**
 * Manages the command prompt in the editor
 */
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

    /**
     * Creates the new command prompt handler
     */
    constructor() {
        this.#commandListElem = document.getElementById("commandList");
        this.#modal = new Modal(document.getElementById("commandPrompt"));

        this.#createInputField();

        // open and close the command prompt
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key.toLowerCase() === "p") {
                event.preventDefault();
                this.#openCommandPrompt();
            }
        });

        document
            .getElementById("commandPromptToggle")
            .addEventListener("click", () => {
                this.#openCommandPrompt();
            });

        // handle command navigation and execution
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
            new OpenKeybindsPromptCommand(),
            new LogoutPromptCommand(),
            new NewProjectPromptCommand(),
            new OpenProjectPromptCommand(),
        ];

        this.#commandList.sort((command1, command2) =>
            command1.commandName.localeCompare(command2.commandName)
        );
    }

    #openCommandPrompt() {
        // Close all other modals
        document.querySelectorAll(".modal.show").forEach((modal) => {
            if (modal !== document.getElementById("commandPrompt")) {
                Modal.getInstance(modal).hide();
            }
        });
        this.#modal.toggle();
        if (
            document.getElementById("commandPrompt").classList.contains("show")
        ) {
            this.#commandInput.value = "";
            this.#commandListElem.innerHTML = "";
            this.#commandInput.focus();
            this.#commandList.forEach((command) => {
                command.occurenceLength = null;
                command.selectedChars = null;
                this.#commandListElem.appendChild(command);
                command.formatCommandName();
            });
            this.#selectedIndex = 0;
            this.#selectCommand();
        }
    }

    /**
     * Creates the input field for the command prompt
     */
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

    /**
     * Selects the command specified by the selectedIndex
     */
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

    /**
     * Updates the command prompt for the updated input given by the user.
     */
    #updateCommandPrompt() {
        this.#currentlyAvailabeCommands = [];
        this.#commandListElem.innerHTML = "";

        // reset the values for each command
        this.#commandList.forEach((command) => {
            command.occurenceLength = null;
            command.selectedChars = null;
        });

        // when no input is given -> render all commands
        if (this.#commandInput.value.length == 0) {
            this.#commandList.forEach((command) => {
                this.#commandListElem.appendChild(command);
                command.formatCommandName();
            });
        } else {
            // calculate the new available commands
            this.#commandList.forEach((command) => {
                command.selectedChars = this.#calculateFirstOccuringIntervall(
                    this.#commandInput.value.toLowerCase(),
                    command.commandName.toLowerCase()
                );

                if (command.occurenceLength !== null) {
                    this.#currentlyAvailabeCommands.push(command);
                }
            });

            this.#currentlyAvailabeCommands.sort(
                (command1, command2) =>
                    command1.occurenceLength - command2.occurenceLength
            );

            // render new availabe commands
            this.#currentlyAvailabeCommands.forEach((command) => {
                this.#commandListElem.appendChild(command);
                command.formatCommandName();
            });
        }

        if (this.#commandListElem.children.length > 0) {
            // select the new first element
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
     * Calculates the first occuring intervall that contains all letters in the input in the correct order
     * @param {String} input the input
     * @param {String} compareTo the string you want to compare against
     * @returns {Number[] | null} containing all the indexes of the letter in the 'compareTo' parameter, or null if no match is found
     */
    #calculateFirstOccuringIntervall(input, compareTo) {
        const indexList = [];

        let lastSeenIndex = 0;

        for (let i = 0; i < input.length; i++) {
            const index = compareTo.indexOf(input[i], lastSeenIndex);
            if (index == -1) {
                return null;
            }
            lastSeenIndex = index + 1;
            indexList.push(index);
        }

        return indexList;
    }
}
