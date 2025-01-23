export class InspectorComponent {
    constructor() {
        if (new.target == InspectorComponent) {
            throw new Error(
                "This class is abstract an cannot be instantiated."
            );
        }
    }

    /**
     * @returns {HTMLElement}
     */
    render() {
        throw new Error(
            "This method must be implemented in every subclass of InspectorComponent"
        );
    }
}

export class SingleFieldInspectorComponent extends InspectorComponent {
    #fieldName;
    #fieldType;
    #getFieldValueFunc;
    #saveFunc;

    /**
     *
     * @param {String} fieldName the name of the field this components going to change
     * @param {"text" | "number"} fieldType
     * @param {Function} getFieldValueFunc
     * @param {Function} saveFunc
     */
    constructor(fieldName, fieldType, getFieldValueFunc, saveFunc) {
        super();
        this.#fieldName = fieldName;
        this.#fieldType = fieldType;
        this.#getFieldValueFunc = getFieldValueFunc;
        this.#saveFunc = saveFunc;
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("d-flex", "p-2", "bg-body", "rounded-3", "gap-2");

        const fieldName = document.createElement("div");
        fieldName.classList.add("d-flex", "align-items-center");
        fieldName.innerHTML = this.#fieldName + ":";
        wrapper.appendChild(fieldName);

        const input = document.createElement("input");
        input.classList.add("form-control", "rounded-1");
        input.type = this.#fieldType;
        input.value = this.#getFieldValueFunc();
        wrapper.appendChild(input);

        // save changes on blur and re-render
        input.addEventListener("change", () => {
            if (input.value !== this.#getFieldValueFunc().toString()) {
                this.#saveFunc(input.value);
            }
        });

        // handle keybinds
        input.addEventListener("keyup", (event) => {
            if (event.key == "Escape") {
                input.value = this.#getFieldValueFunc();
                input.blur();
            } else if (event.key == "Enter") {
                input.blur();
            }
        });

        return wrapper;
    }
}

export class MultiFieldInspectorComponent extends InspectorComponent {
    #componentList;
    #title;

    /**
     *
     * @param {String} title
     * @param {InspectorComponent[]} componentList
     */
    constructor(title, componentList) {
        super();
        this.#componentList = componentList;
        this.#title = title;
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(
            "d-flex",
            "flex-column",
            "p-2",
            "bg-body",
            "rounded-3"
        );

        const headline = document.createElement("div");
        headline.classList.add("fw-bold", "fs-4", "px-2");
        headline.innerHTML = this.#title;
        wrapper.appendChild(headline);

        const body = document.createElement("div");
        body.classList.add(
            "d-flex",
            "flex-column",
            "bg-body",
            "rounded-3",
            "gap-2"
        );
        wrapper.appendChild(body);

        this.#componentList.forEach((component) => {
            body.appendChild(component.render());
        });

        return wrapper;
    }
}

export class SelectFieldInspectorComponent extends InspectorComponent {
    #fieldName;
    #options;
    #getFieldValueFunc;
    #saveFunc;

    /**
     *
     * @param {String} fieldName the name of the field
     * @param {{label: String, value: any}[]} options an array of options the user can choose from
     * @param {Function} getFieldValueFunc
     * @param {Function} saveFunc
     */
    constructor(fieldName, options, getFieldValueFunc, saveFunc) {
        super();
        this.#fieldName = fieldName;
        this.#options = options;
        this.#getFieldValueFunc = getFieldValueFunc;
        this.#saveFunc = saveFunc;
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("d-flex", "p-2", "bg-body", "rounded-3", "gap-2");

        const fieldName = document.createElement("div");
        fieldName.classList.add("d-flex", "align-items-center");
        fieldName.innerHTML = this.#fieldName + ":";
        wrapper.appendChild(fieldName);

        const select = document.createElement("select");
        select.classList.add("form-select", "rounded-1");

        // Populate the dropdown with options
        this.#options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.label = option.label;
            select.appendChild(optionElement);
        });

        wrapper.appendChild(select);

        // save changes on blur and re-render
        select.addEventListener("change", () => {
            if (select.value !== this.#getFieldValueFunc().toString()) {
                this.#saveFunc(select.value);
            }
            select.value = this.#getFieldValueFunc();
        });

        return wrapper;
    }
}

export class SliderFieldInspectorComponent extends InspectorComponent {
    #fieldName;
    #step;
    #min;
    #max;
    #getFieldValueFunc;
    #updateFunc;
    #saveFunc;

    /**
     *
     * @param {String} fieldName
     * @param {Number} min
     * @param {Number} max
     * @param {Function} getFieldValueFunc
     * @param {Function} updateFunc
     * @param {Function} saveFunc
     * @param {Number} [step=undefined]
     */
    constructor(
        fieldName,
        min,
        max,
        getFieldValueFunc,
        updateFunc,
        saveFunc,
        step = undefined
    ) {
        super();
        this.#fieldName = fieldName;
        this.#min = min;
        this.#max = max;
        this.#step = step;
        this.#getFieldValueFunc = getFieldValueFunc;
        this.#updateFunc = updateFunc;
        this.#saveFunc = saveFunc;
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(
            "d-flex",
            "flex-column",
            "p-2",
            "bg-body",
            "rounded-3",
            "gap-2"
        );

        const header = document.createElement("div");
        header.classList.add("d-flex", "gap-2");
        wrapper.appendChild(header);

        const fieldName = document.createElement("div");
        fieldName.classList.add("d-flex", "align-items-center");
        fieldName.innerHTML = this.#fieldName + ":";
        header.appendChild(fieldName);

        const input = document.createElement("input");
        input.classList.add("form-control", "rounded-1");
        input.type = "number";
        input.value = this.#getFieldValueFunc();
        header.appendChild(input);

        const slider = document.createElement("input");
        slider.classList.add("form-range", "rounded-1");
        slider.type = "range";
        slider.min = this.#min.toString();
        slider.max = this.#max.toString();
        if (this.#step) {
            slider.step = this.#step.toString();
        }
        slider.value = this.#getFieldValueFunc();
        wrapper.appendChild(slider);

        // save the slider changes
        slider.addEventListener("change", () => {
            this.#saveFunc(slider.value);
            input.value = this.#getFieldValueFunc();
        });

        // save the input changes
        input.addEventListener("blur", () => {
            if (
                input.value !== this.#getFieldValueFunc().toString() &&
                parseFloat(input.value) >= this.#min &&
                parseFloat(input.value) <= this.#max
            ) {
                this.#saveFunc(input.value);
            }
            input.value = this.#getFieldValueFunc();
            slider.value = this.#getFieldValueFunc();
        });

        // handle keybinds
        input.addEventListener("keyup", (event) => {
            if (event.key == "Escape") {
                input.value = this.#getFieldValueFunc();
                input.blur();
            } else if (event.key == "Enter") {
                input.blur();
            }
        });

        return wrapper;
    }
}
