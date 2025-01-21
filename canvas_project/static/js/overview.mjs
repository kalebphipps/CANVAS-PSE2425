import { Editor } from "editor";
import { Heliostat, LightSource, ObjectType, Receiver } from "objects";
import { Picker } from "picker";

export class OverviewHandler {
    #editor;
    #picker;
    #overviewButton;
    #selectedItems = [];
    #heliostatList;
    #receiverList;
    #lightsourceList;
    #heliostatMap = new Map();
    #receiverMap = new Map();
    #lightsourceMap = new Map();

    /**
     * Creates a new overview handler.
     * @param {Picker} picker the picker currently in use.
     */
    constructor(picker) {
        this.#picker = picker;
        this.#editor = new Editor();
        this.#overviewButton = document.getElementById("overview-tab");
        this.#heliostatList = document.getElementById("heliostatList");
        this.#receiverList = document.getElementById("receiverList");
        this.#lightsourceList = document.getElementById("lightsourceList");

        // render when overview tab is selected
        this.#overviewButton.addEventListener("click", () => {
            this.#render();
        });

        // re-render when a new item is selected
        document
            .getElementById("canvas")
            .addEventListener("itemSelected", () => {
                if (this.#overviewButton.classList.contains("active")) {
                    this.#render();
                }
            });

        this.#handleUserInput();
    }

    #render() {
        // clear the list
        this.#heliostatList.innerHTML = "";
        this.#receiverList.innerHTML = "";
        this.#lightsourceList.innerHTML = "";

        const objects = this.#editor.objects;
        const selectedObjects = this.#picker.getSelectedObjects();

        // reset the selected items list, to be filled with the items specified by selectedObjects
        this.#selectedItems = [];

        // render the objects
        objects.forEach((element) => {
            const selected = selectedObjects.includes(element);

            switch (element.objectType) {
                case ObjectType.HELIOSTAT:
                    this.#heliostatList.appendChild(
                        this.#createHeliostatEntry(element, selected)
                    );
                    break;
                case ObjectType.RECEIVER:
                    this.#receiverList.appendChild(
                        this.#createReceiverEntry(element, selected)
                    );
                    break;
                case ObjectType.LIGHTSOURCE:
                    this.#lightsourceList.appendChild(
                        this.#createLightsourceEntry(element, selected)
                    );
                    break;
                default:
                    console.warn(`Unknown object type: ${element.objectType}`);
            }
        });

        if (this.#heliostatList.children.length == 0) {
            const text = document.createElement("i");
            text.classList = "text-secondary";
            text.innerHTML = "No heliostats in this scene";
            this.#heliostatList.appendChild(text);
        }

        if (this.#receiverList.children.length == 0) {
            const text = document.createElement("i");
            text.classList = "text-secondary";
            text.innerHTML = "No receivers in this scene";
            this.#receiverList.appendChild(text);
        }

        if (this.#lightsourceList.children.length == 0) {
            const text = document.createElement("i");
            text.classList = "text-secondary";
            text.innerHTML = "No light sources in this scene";
            this.#lightsourceList.appendChild(text);
        }
    }

    /**
     * Creates an entry for the given heliostat
     * @param {Heliostat} object the heliostat you want to create an entry for
     * @param {Boolean} selected if the object is selected or not
     * @returns the html element
     */
    #createHeliostatEntry(object, selected) {
        this.#heliostatMap.set(`${object.apiID}`, object);

        // create the html element to render
        const heliostatEntry = document.createElement("div");
        heliostatEntry.role = "button";
        heliostatEntry.classList =
            "d-flex gap-2 p-2 rounded-2 overviewElem " +
            (selected ? "bg-primary-subtle" : "bg-body-secondary");

        const icon = document.createElement("i");
        icon.classList = "bi-arrow-up-right-square d-flex align-items-center";
        heliostatEntry.appendChild(icon);

        const text = document.createElement("div");
        text.classList = "w-100 d-flex align-items-center";
        text.innerHTML =
            object.heliostatName !== "" && object.heliostatName !== ""
                ? object.heliostatName
                : "Heliostat";
        heliostatEntry.appendChild(text);

        const button = document.createElement("button");
        button.classList = "btn btn-primary custom-btn";
        const buttonIcon = document.createElement("i");
        buttonIcon.classList = "bi bi-pencil-square";
        button.appendChild(buttonIcon);
        heliostatEntry.appendChild(button);

        this.#addEditFunctionality(button, object);

        heliostatEntry.dataset.apiId = object.apiID;
        heliostatEntry.dataset.objectType = ObjectType.HELIOSTAT;

        if (selected) {
            this.#selectedItems.push(heliostatEntry);
        }

        return heliostatEntry;
    }

    /**
     * Creates an entry for the given receiver
     * @param {Receiver} object the receiver you want to create an entry for
     * @param {Boolean} selected if the object is selected or not
     * @returns the html element
     */
    #createReceiverEntry(object, selected) {
        this.#receiverMap.set(`${object.apiID}`, object);

        // create the html element to render
        const receiverEntry = document.createElement("div");
        receiverEntry.role = "button";
        receiverEntry.classList =
            "d-flex gap-2 p-2 rounded-2 overviewElem " +
            (selected ? "bg-primary-subtle" : "bg-body-secondary");

        const icon = document.createElement("i");
        icon.classList = "bi bi-align-bottom d-flex align-items-center";
        receiverEntry.appendChild(icon);

        const text = document.createElement("div");
        text.classList = "w-100 d-flex align-items-center";
        text.innerHTML =
            object.receiverName !== "" && object.receiverName
                ? object.receiverName
                : "Receiver";
        receiverEntry.appendChild(text);

        const button = document.createElement("button");
        button.classList = "btn btn-primary custom-btn";
        const buttonIcon = document.createElement("i");
        buttonIcon.classList = "bi bi-pencil-square";
        button.appendChild(buttonIcon);
        receiverEntry.appendChild(button);

        this.#addEditFunctionality(button, object);

        receiverEntry.dataset.apiId = object.apiID;
        receiverEntry.dataset.objectType = ObjectType.RECEIVER;

        if (selected) {
            this.#selectedItems.push(receiverEntry);
        }

        return receiverEntry;
    }

    /**
     * Creates an entry for the given light source
     * @param {LightSource} object the light source you want to create an entry for
     * @param {Boolean} selected if the object is selected or not
     * @returns the html element
     */
    #createLightsourceEntry(object, selected) {
        this.#lightsourceMap.set(`${object.apiID}`, object);

        // create the html element to render
        const lightsourceEntry = document.createElement("div");
        lightsourceEntry.role = "button";
        lightsourceEntry.classList =
            "d-flex gap-2 p-2 rounded-2 overviewElem " +
            (selected ? "bg-primary-subtle" : "bg-body-secondary");

        const icon = document.createElement("i");
        icon.classList = "bi bi-lightbulb d-flex align-items-center";
        lightsourceEntry.appendChild(icon);

        const text = document.createElement("div");
        text.classList = "w-100 d-flex align-items-center";
        text.innerHTML =
            object.lightsourceName !== "" && object.lightsourceName
                ? object.lightsourceName
                : "Light source";
        lightsourceEntry.appendChild(text);

        const button = document.createElement("button");
        button.classList = "btn btn-primary custom-btn";
        const buttonIcon = document.createElement("i");
        buttonIcon.classList = "bi bi-pencil-square";
        button.appendChild(buttonIcon);
        lightsourceEntry.appendChild(button);

        this.#addEditFunctionality(button, object);

        lightsourceEntry.dataset.apiId = object.apiID;
        lightsourceEntry.dataset.objectType = ObjectType.LIGHTSOURCE;

        if (selected) {
            this.#selectedItems.push(lightsourceEntry);
        }

        return lightsourceEntry;
    }

    #handleUserInput() {
        document
            .getElementById("accordionOverview")
            .addEventListener("click", (event) => {
                // get the closest parent which has the overviewElem class
                const target = event.target.closest(".overviewElem");

                if (target && target.classList.contains("overviewElem")) {
                    if (event.ctrlKey && !event.shiftKey) {
                        if (this.#selectedItems.includes(target)) {
                            this.#selectedItems.splice(
                                this.#selectedItems.indexOf(target),
                                1
                            );
                        } else {
                            this.#selectedItems.push(target);
                        }
                    } else if (!event.ctrlKey && event.shiftKey) {
                        //
                    } else {
                        this.#selectedItems = [target];
                    }

                    const selectedObjects = [];
                    this.#selectedItems.forEach((element) => {
                        switch (element.dataset.objectType) {
                            case ObjectType.HELIOSTAT:
                                selectedObjects.push(
                                    this.#heliostatMap.get(
                                        `${element.dataset.apiId}`
                                    )
                                );
                                break;
                            case ObjectType.RECEIVER:
                                selectedObjects.push(
                                    this.#receiverMap.get(
                                        `${element.dataset.apiId}`
                                    )
                                );
                                break;
                            case ObjectType.LIGHTSOURCE:
                                selectedObjects.push(
                                    this.#lightsourceMap.get(
                                        `${element.dataset.apiId}`
                                    )
                                );
                                break;
                            default:
                                console.warn(
                                    `Unknown object type: ${element.objectType}`
                                );
                        }
                    });
                    this.#picker.setSelection(selectedObjects);
                }
            });
    }

    #addEditFunctionality(button, object) {
        const entry = button.parentElement;
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.classList = "form-control rounded-1";
            switch (object.objectType) {
                case ObjectType.HELIOSTAT:
                    inputField.value =
                        object.heliostatName && object.heliostatName !== ""
                            ? object.heliostatName
                            : "Heliostat";
                    break;
                case ObjectType.RECEIVER:
                    inputField.value =
                        object.receiverName && object.receiverName !== ""
                            ? object.receiverName
                            : "Receiver";
                    break;
                case ObjectType.LIGHTSOURCE:
                    inputField.value =
                        object.lightsourceName && object.lightsourceName !== ""
                            ? object.lightsourceName
                            : "Light source";
            }
            entry.innerHTML = "";
            entry.appendChild(inputField);
            inputField.focus();

            inputField.addEventListener("click", (event) => {
                event.stopPropagation();
            });

            inputField.addEventListener("keyup", (event) => {
                if (event.key == "Enter") {
                    inputField.blur();
                }
            });

            inputField.addEventListener("blur", () => {
                switch (object.objectType) {
                    case ObjectType.HELIOSTAT:
                        object.heliostatName = inputField.value;
                        break;
                    case ObjectType.RECEIVER:
                        object.receiverName = inputField.value;
                        break;
                    case ObjectType.LIGHTSOURCE:
                        object.lightsourceName = inputField.value;
                }
                // TODO: Make change through command when command exists
                this.#render();
            });
        });
    }
}
