export default class MovingTileSprite extends Phaser.GameObjects.TileSprite {

    private _speedX : number = 0;
    private _speedY : number = 0;
    constructor(scene: Phaser.Scene, positionX : number, positionY : number, width : number, height : number, 
        key : string, speedX : number, speedY : number) {

        super(scene, positionX, positionY, width, height, key);
        this._speedX = speedX;
        this._speedY = speedY;
        scene.add.existing(this);
    }

    move(){
        this.tilePositionX += this._speedX;
        this.tilePositionY += this._speedY;
    }
}
