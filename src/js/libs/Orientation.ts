import gameConfig  from '../../assets/data/game_config.json';	

export default class Orientation {
    private firstResolution!: string;
  
    constructor() {

    }
  
    blockGame(active: boolean): void {
        const turnElement = document.getElementById("turn");
        const gameElement = document.getElementById("game");
  
        if (!turnElement || !gameElement) {
            console.error('Required DOM elements not found.');
            return;
        }
  
        if (active) {
            turnElement.style.display = "block";
            gameElement.style.display = "none";
        } else {
            turnElement.style.display = "none";
            gameElement.style.display = "block";
            if (this.getResolution() !== this.firstResolution) {
                window.location.reload();
            }
        }
    }
  
    checkOrientation(): void {
        this.checkBlockResolution();
        this.onResizeCallback();
    }
  
    private onResizeCallback(): void {
        window.onresize = () => {
            this.checkBlockResolution();
        };
    }
  
    private checkBlockResolution(): void {
        if (!this.firstResolution) {
            this.firstResolution = this.getResolution();
        }
  
        const defaultOrientation: string = gameConfig.orientation;
  
        if (window.innerWidth > window.innerHeight) {
            this.blockGame(defaultOrientation === 'portrait');
        } else {
            this.blockGame(defaultOrientation === 'landscape');
        }
    }
  
    private getResolution(): string {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
}
