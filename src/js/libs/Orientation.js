
import gameConfig  from '../../assets/data/game_config.json';	
export default class Orientation {
    constructor() {
        this.firstResolution = null;
    }

    blockGame(active) {
        if (active) {
            document.getElementById("turn").style.display = "block";
            document.getElementById("game").style.display = "none";
        } else {
            document.getElementById("turn").style.display = "none";
            document.getElementById("game").style.display = "block";
            if (this.getResolution() !== this.firstResolution) {
                window.location.reload(false);
            }
        }
    }

    checkOrientation() {
        this.checkBlockResolution();
        this.onResizeCallback();
    }

    onResizeCallback() {
        window.onresize = () => {
            this.checkBlockResolution();
        };
    }

    checkBlockResolution() {
        if (!this.firstResolution) { 
            this.firstResolution = this.getResolution();
        }
        const defaultOrientation = gameConfig.orientation;

        if (window.innerWidth > window.innerHeight) {
            this.blockGame(defaultOrientation === 'portrait');
        } else {
            this.blockGame(defaultOrientation === 'landscape');
        }
    }

    getResolution() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
}
