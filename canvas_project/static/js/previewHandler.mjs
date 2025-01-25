import * as THREE from "three";

export class PreviewHandler {
    #renderer;
    #camera;
    /**
     * @type {THREE.Scene}
     */
    #scene;

    /**
     * @param {THREE.WebGLRenderer} renderer
     * @param {THREE.Camera} camera
     * @param {THREE.Scene} scene
     */
    constructor(renderer, camera, scene) {
        this.#renderer = renderer;
        this.#camera = camera;
        this.#scene = scene;

        // save preview every minute
        setInterval(() => {
            this.#savePreview();
        }, 60000);
    }

    async #savePreview() {
        this.#renderer.render(this.#scene, this.#camera);

        const preview = this.#renderer.domElement.toDataURL();

        const blob = await this.#dataURLToBlob(preview);

        const formData = new FormData();
        formData.append("preview", blob, "preview.png");

        fetch(window.location.href + "/upload", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": this.#getCookie("csrftoken"),
            },
        }).catch((error) => {
            console.error("Error uploading file:", error);
        });
    }

    async #dataURLToBlob(dataURL) {
        return fetch(dataURL).then((res) => res.blob());
    }
    /**
     * Gets the cookie specified by the name
     * @param {String} name The name of the cookie you want to get.
     * @returns the cookie or null if it couldn't be found.
     */
    #getCookie(name) {
        if (!document.cookie) {
            return null;
        }

        // document.cookie is a key=value list separated by ';'
        const xsrfCookies = document.cookie
            .split(";")
            .map((c) => c.trim())
            //filter the right cookie name
            .filter((c) => c.startsWith(name + "="));

        if (xsrfCookies.length === 0) {
            return null;
        }
        // return the decoded value of the first cookie found
        return decodeURIComponent(xsrfCookies[0].split("=")[1]);
    }
}
