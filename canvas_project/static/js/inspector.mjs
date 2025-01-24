import { Picker } from "picker";
import { ItemDeletedEvent } from "./deleteComands.mjs";
import { SelectableObject } from "objects";
import { ItemUpdatedEvent } from "updateCommands";

export class Inspector {
    #picker;
    /**
     * @type {SelectableObject[]}
     */
    #objectList;
    #inspectorElem;

    /**
     * Creates a new inspector
     * @param {Picker} picker the picker in use for this scene
     */
    constructor(picker) {
        this.#picker = picker;
        this.#inspectorElem = document.getElementById("inspector");

        const canvas = document.getElementById("canvas");
        canvas.addEventListener("itemSelected", () => {
            this.#render();
        });

        canvas.addEventListener(
            "itemDeleted",
            (/** @type {ItemDeletedEvent}*/ event) => {
                if (
                    this.#objectList.length == 1 &&
                    event.detail.item == this.#objectList[0]
                ) {
                    this.#render();
                }
            }
        );

        canvas.addEventListener(
            "itemUpdated",
            (/** @type {ItemUpdatedEvent} */ event) => {
                if (
                    this.#objectList.length == 1 &&
                    event.detail.item == this.#objectList[0]
                )
                    this.#render();
            }
        );
    }

    #render() {
        this.#objectList = this.#picker.getSelectedObjects();

        if (this.#objectList.length == 0) {
            this.#inspectorElem.innerHTML =
                "Select an object by clicking on it";
        } else if (this.#objectList.length == 1) {
            this.#inspectorElem.innerHTML = "";
            this.#objectList[0].inspectorComponents.forEach((component) => {
                this.#inspectorElem.appendChild(component.render());
            });
        } else {
            this.#inspectorElem.innerHTML =
                "Multi selection is not yet supported :(";
        }
    }
}
