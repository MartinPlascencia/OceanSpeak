export default class Fish extends Phaser.GameObjects.Image {

    
    private direction: number;
    private speed: number;
    private turnSpeed: number;
    private isMoving: boolean;
    private padding: number;
    private rightLimit: number;
    private bottomLimit: number;
    constructor(scene: Phaser.Scene, position: { x: number, y: number }, atlas: string, color: string, bottomLimit: number, rightLimit: number) {
        super(scene, position.x, position.y, atlas, color + '_fish');
        this.scaleX*= -1;
        scene.add.existing(this);

        this.direction = Math.random() * Math.PI * 2;
        this.speed = 2 + Math.random() * 5;
        this.turnSpeed = Math.random() - 0.8;

        this.padding = this.displayWidth;
        this.rightLimit = rightLimit + this.padding * 2;
        this.bottomLimit = bottomLimit + this.padding * 2;

        this.isMoving = true;
    }

    stop() {
        this.isMoving = false;
    }

    startMoving() {
        this.isMoving = true;
    }

    /* move() {

        if (!this.isMoving){
            return;
        }
        this.direction += this.turnSpeed * 0.01;
        this.x += Math.sin(this.direction) * this.speed;
        this.y += Math.cos(this.direction) * this.speed;
        this.rotation = -this.direction - Math.PI / 2;

        if (this.x < -this.padding)
        {
            this.x += this.rightLimit + this.padding;
        }
        if (this.x > this.rightLimit + this.padding)
        {
            this.x -= this.rightLimit + this.padding;
        }
        if (this.y < -this.padding)
        {
            this.y += this.bottomLimit + this.padding;
        }
        if (this.y > this.bottomLimit + this.padding)
        {
            this.y -= this.bottomLimit + this.padding;
        }
    } */

    move() {
        if (!this.isMoving) {
            return;
        }
    
        // Add slight random changes to direction over time
        const randomTurn = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and 0.05
        this.direction += this.turnSpeed * 0.01 + randomTurn;
    
        // Adjust speed slightly for organic movement
        const randomSpeedVariation = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and 0.05
        this.speed += randomSpeedVariation;
    
        // Keep speed within reasonable bounds
        this.speed = Phaser.Math.Clamp(this.speed, 3, 10); // Adjust min/max speed as needed
    
        // Update position
        this.x += Math.sin(this.direction) * this.speed;
        this.y += Math.cos(this.direction) * this.speed;
    
        // Update rotation to match movement direction
        this.rotation = -this.direction - Math.PI / 2;
    
        // Screen wrap logic
        if (this.x < -this.padding) {
            this.x += this.rightLimit;
        }
        if (this.x > this.rightLimit) {
            this.x -= this.rightLimit;
        }
        if (this.y < -this.padding) {
            this.y += this.bottomLimit;
        }
        if (this.y > this.bottomLimit) {
            this.y -= this.bottomLimit;
        }
    
        // Optionally, make fish occasionally pause or dart forward
        if (Math.random() < 0.01) {
            this.speed = Math.random() < 0.5 ? 0 : Phaser.Math.Between(2, 4); // Dart or stop randomly
        }
    }



}






