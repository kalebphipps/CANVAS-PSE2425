export class Picker {
    constructor(camera, transformControls, selectionBox, selectableGroup, modeSelector) {
        this.camera = camera;
        this.transformControls = transformControls;
        this.selectionBox = selectionBox;
        this.selectableGroup = selectableGroup;
        this.modeSelector = modeSelector;
        this.selectedObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.selectedObjects = [];
        this.group = new THREE.Group();

        // TODO: Event listener for click
        window.addEventListener("click", (event) => {  
            const normalizedPosition = { x: event.clientX / window.innerWidth * 2 - 1, y: - (event.clientY / window.innerHeight) * 2 + 1 };
            this.pick(normalizedPosition, this.camera);
        } );

        // TODO: Event listener for Rectangular selection

        // TODO: Event listener for shift key binding to add objects to selection


    }

    getSelectedObjects() {
        return this.selectedObjects;
    }

    setSelection(objectList) {
        this.selectedObjects = objectList;
        // TODO: mark all newly selected objects

        this.itemSelectedEvent();
    }

    // TODO: sigle pick selection
    pick(normalizedPosition, camera) {

        this.itemSelectedEvent();
    }

    // TODO: Rectangular selection
    pickMultiSelection(start, end) {

        this.itemSelectedEvent();
    }


    // TODO: Add objects to selection
    addToSelection(normalizedPosition) { 

        this.itemSelectedEvent();
    }


    // inform the inspector with "item selected" event
    itemSelectedEvent() {
        const event = new CustomEvent("itemSelected", {
            detail: { object: this.selectedObject },
          });
          document.getElementById("inspector").dispatchEvent(event);
    }
}