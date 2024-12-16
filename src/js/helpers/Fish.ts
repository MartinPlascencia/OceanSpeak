import ColorInteractiveAsset from "./ColorInteractiveAsset";
export default class Fish extends ColorInteractiveAsset {

    private _direction: number;
    private _speed!: number;
    private _maxSpeed!: number; 
    private _turnSpeed: number;
    private _isMoving: boolean = false;
    private _padding: number;
    private _rightLimit: number;
    private _bottomLimit: number;

    constructor(scene: Phaser.Scene, position: { x: number, y: number }, atlas: string, color: string, bottomLimit: number, rightLimit: number,
        scale: number = 1) {

        super(scene, position.x, position.y, atlas, color + '_fish', color, scale);
        this.setScale(scale);
        this.flipX = true;
        scene.add.existing(this);

        this._direction = Math.random() * Math.PI * 2;
        this._turnSpeed = Math.random() - 0.8;

        this._padding = this.displayWidth;
        this._rightLimit = rightLimit + this._padding * 2;
        this._bottomLimit = bottomLimit + this._padding * 2;

    }

    setSpeed(speed: number) {
        this._speed = speed + (Math.random() - 0.5) * 3;
        this._maxSpeed = speed;
    }

    stop() {
        this._isMoving = false;
    }

    startMoving() {
        this._isMoving = true;
    }

    move() {
        if (!this._isMoving) {
            return;
        }

        // Add slight random changes to direction over time
        const randomTurn = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and 0.05
        this._direction += this._turnSpeed * 0.01 + randomTurn;

        const minAngle = Phaser.Math.DegToRad(-90); // -90° in radians
        const maxAngle = Phaser.Math.DegToRad(90);  // 90° in radians
        this._direction = Phaser.Math.Clamp(this._direction, minAngle, maxAngle);

        // Adjust speed slightly for organic movement
        const randomSpeedVariation = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and 0.05
        this._speed += randomSpeedVariation;

        this.flipY = this._direction > 0; // Flip when moving right

        // Keep speed within reasonable bounds
        this._speed = Phaser.Math.Clamp(this._speed, 3, this._maxSpeed); // Adjust min/max speed as needed

        // Update position
        this.x += Math.sin(this._direction) * this._speed;
        this.y += Math.cos(this._direction) * this._speed;

        // Update rotation to match movement direction
        this.rotation = -this._direction - Math.PI / 2;

        // Screen wrap logic
        if (this.x < -this._padding) {
            this.x += this._rightLimit;
        }
        if (this.x > this._rightLimit) {
            this.x -= this._rightLimit;
        }
        if (this.y < -this._padding) {
            this.y += this._bottomLimit;
        }
        if (this.y > this._bottomLimit) {
            this.y -= this._bottomLimit;
        }

        // Optionally, make fish occasionally pause or dart forward
        if (Math.random() < 0.01) {
            this._speed = Math.random() < 0.5 ? 0 : Phaser.Math.Between(2, 4); // Dart or stop randomly
        }
    }
}
