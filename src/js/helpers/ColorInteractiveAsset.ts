export default class ColorInteractiveAsset extends Phaser.GameObjects.Image {

    private _color : string;

    constructor(scene: Phaser.Scene, positionX : number, positionY : number, atlas: string, key : string, color: string, scale: number = 1) {

        super(scene, positionX, positionY, atlas, key);
        this.setScale(scale);
        this._color = color;
    }

    getColor() {
        return this._color;
    }

    addInputCallback(callback: Function) {
        this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            callback(this);
        });
    }

    activateInput(active: boolean) {
        if (active) {
            this.setInteractive();
        } else {
            this.disableInteractive();
        }
    }
}
