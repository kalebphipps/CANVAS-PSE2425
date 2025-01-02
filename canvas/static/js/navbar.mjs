let menuInstance = null;

export class Navbar {
  constructor() {
    if (menuInstance) return this;
    menuInstance = this;

    this.setupFullscreen();
  }

  setupFullscreen() {
    let fullscreen = document.getElementById("fullscreen");

    // Safari
    if (navigator.userAgent.indexOf("Safari") > -1) {
      fullscreen.onclick = (_) => {
        if (document.webkitFullscreenElement === null) {
          document.documentElement.webkitRequestFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      };
      return;
    }

    fullscreen.onclick = (_) => {
      if (document.fullscreenElement === null) {
        _ = document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        _ = document.exitFullscreen();
      }
    };
  }
}
