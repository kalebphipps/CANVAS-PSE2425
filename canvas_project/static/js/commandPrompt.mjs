import { Modal } from "bootstrap";

export class CommandPrompt {
    /**
     * @type {HTMLInputElement}
     */
    #commandInput;
    #commandList;
    #modal;

    constructor() {
        this.#commandList = document.getElementById("commandList");
        this.#modal = new Modal(document.getElementById("commandPrompt"));

        this.#initializeComponents();

        // open and close the command prompt
        document.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "p") {
                event.preventDefault();
                this.#modal.toggle();
                this.#renderCommandPrompt();
            }
        });
    }
    #initializeComponents() {
        this.#commandInput = document.createElement("input");
        this.#commandInput.classList.add(
            "form-control",
            "border-0",
            "shadow-none"
        );
        document.getElementById("commandInput").appendChild(this.#commandInput);
    }
    #renderCommandPrompt() {
        this.#commandInput.value = "";
        this.#commandInput.focus();
    }
}
