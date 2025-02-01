export class Navbar {
    constructor() {
        this.#setupFullscreen();
        this.#addElement();
        this.#fileOptions();
    }

    #setupFullscreen() {
        let fullscreen = document.getElementById('fullscreen');

        // Safari
        if (navigator.userAgent.indexOf('Safari') > -1) {
            fullscreen.onclick = (_) => {
                if (document.webkitFullscreenElement === null ) {
                    document.documentElement.webkitRequestFullscreen();
                } else if ( document.webkitExitFullscreen ) {
                    document.webkitExitFullscreen();
                }
            }
            return ;
        }

        fullscreen.onclick = (_) => {
		    if ( document.fullscreenElement === null ) {
			    _ = document.documentElement.requestFullscreen();
		    } else if ( document.exitFullscreen ) {
			    _ = document.exitFullscreen();
		    }
        }
    }

    #addElement() {
        let heliostat = document.getElementById('heliostat');
        let receiver = document.getElementById('receiver');
        let lightSource = document.getElementById('lightSource');

        heliostat.onclick = (_) => {
            
        }

        receiver.onclick = (_) => {
            
        }

        lightSource.onclick = (_) => {
            
        }
    }

    #fileOptions() {
        let newButton = document.getElementById('new');
        let importButton = document.getElementById('import');
        let exportButton = document.getElementById('export');

        newButton.onclick = (_) => {
        }

        importButton.onclick = (_) => {
        }

        exportButton.onclick = (_) => {
        }

    }
}