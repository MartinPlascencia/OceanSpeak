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
    private _lastPositionX : number = 0;

    private _timeToFlip : number = 500;
    private _flipCooldown : number = 0;
    private _flipDecreasement : number = 16;

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

        this.updateDirection();
        this.updateSpeed();
        this.handleFlipping();
        this.updatePosition();
        this.applyScreenWrapping();

    }

    private updateDirection(): void {
        const randomTurn = (Math.random() - 0.5) * 0.1; 
        this._direction += this._turnSpeed * 0.01 + randomTurn;
    }
    
    private updateSpeed(): void {
        const randomSpeedVariation = (Math.random() - 0.5) * 0.1; 
        this._speed += randomSpeedVariation;
        this._speed = Phaser.Math.Clamp(this._speed, 3, this._maxSpeed);
    }
    
    private handleFlipping(): void {
        if (this._flipCooldown <= 0) {
            this.flipY = this._lastPositionX < this.x; 
            this._flipCooldown = this._timeToFlip; 
        }
    
        if (this._flipCooldown > 0) {
            this._flipCooldown -= this._flipDecreasement;
        }
    
        this._lastPositionX = this.x;
    }
    
    private updatePosition(): void {
        this.x += Math.sin(this._direction) * this._speed;
        this.y += Math.cos(this._direction) * this._speed;
    
        this.rotation = -this._direction - Math.PI / 2;
    }
    
    private applyScreenWrapping(): void {
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
    }
    
}
