export default class Effects {
    private _scene: Phaser.Scene;
    private _tweens: Phaser.Tweens.TweenManager;
    private _particlesGroup: Map<string, Phaser.GameObjects.Particles.ParticleEmitter> = new Map();
    private _textParticles: Phaser.GameObjects.BitmapText[] = [];
    private _whiteFade!: Phaser.GameObjects.Rectangle;
    private _spriteParticlesGroup!: Phaser.GameObjects.Group;
    private _displacementEffect!: any;

    constructor(scene: Phaser.Scene, noParticles : boolean = false) {        
        this._scene = scene;
        this._tweens = scene.tweens;

        if (!noParticles) {
            this.addTextParticles();
        }

        this.createFade();
    }

    private addTextParticles(): void {
        this._textParticles = [];
    }

    public createGroundParticles(name: string, atlasName: string, keys: string[] | string, gravityY: number, 
        keepPlaying = false, particlesNumber = 150): void {
        const particles = this._scene.add.particles(0, 0, atlasName, {
            frame: keys,
            x: { random: [0, window.innerWidth * 2] },
            y: window.innerWidth + 300,
            lifespan: 10000,
            gravityY,
            frequency: particlesNumber,
            scale: { min: 0.3, max: 0.8 },
            angle: { min: 0, max: 360 },
            rotate: { start: 0, end: 450 },
            accelerationY: { min: -10, max: -70 },
            speedX: { min: -100, max: 100 },
        });

        this._particlesGroup.set(name, particles);

        if (keepPlaying) {
            particles.start();
        } else {
            particles.stop();
        }
    }

    private createTextParticle(font: string): Phaser.GameObjects.BitmapText {
        const textParticle = this._scene.add.bitmapText(0, 0, font, '0', 18);
        textParticle.setOrigin(0.5);
        textParticle.alpha = 0;
        textParticle.setCenterAlign();
        this._textParticles.push(textParticle);
        return textParticle;
    }

    private createFade(): void {
        this._whiteFade = this._scene.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 10, 
            window.innerHeight * 10, 0xffffff).setAlpha(0);
    }

    public showFade(duration = 350, callback?: () => void): void {
        this._whiteFade.alpha = 1;
        this._tweens.add({
            targets: this._whiteFade,
            alpha: 0,
            duration,
            onComplete: callback,
        });
    }

    public fadeOut(duration = 350, callback?: () => void): void {
        this._whiteFade.alpha = 0;
        this._tweens.add({
            targets: this._whiteFade,
            alpha: 1,
            duration,
            onComplete: callback,
        });
    }

    private positionObject(asset : any, obj : Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, offset : {x:number, y:number} ){
        let worldObj = obj.getWorldTransformMatrix()
        asset.x = worldObj.tx + offset.x;
        asset.y = worldObj.ty + offset.y;
    }

    showTextParticles(text : string, obj : Phaser.GameObjects.Sprite | Phaser.GameObjects.Image , offsetPosition : {x:number, y:number} = {x:0, y:0},
        fontSize : number = 55, tint = 0xffffff, font : string, dontMove : boolean, letterSpacing = 0){
        let particleText = this._textParticles.find(particle => particle.alpha == 0);
        if (!particleText) {
            particleText = this.createTextParticle(font)
        }
        this.positionObject(particleText, obj, offsetPosition);
        particleText.fontSize = fontSize;
        particleText.alpha = 1;
        particleText.text = text;
        particleText.tint = tint;
        particleText.setLetterSpacing(letterSpacing);
        this._tweens.add({targets:particleText, alpha:0, duration:500, delay:500})
        if (!dontMove) {
			this._tweens.add({targets:particleText, y:particleText.y - 100, duration:1000})
		}  
    }

    private createParticles(tag: string, atlasName: string, ignoreGravity?: boolean): Phaser.GameObjects.Particles.ParticleEmitter {
        const particleConfig = {
            frame: tag,
            speed: { min: -400, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 3, end: 0 },
            alpha: { start: 1, end: 0 },
            maxParticles: 200,
            emitting: false,
            gravityY: 300,
            rotate: { min: 180, max: 360 },
        };

        if (ignoreGravity) {
            particleConfig.gravityY = 0;
        }

        const spriteParticles = this._scene.add.particles(0, 0, atlasName, particleConfig);
        this._particlesGroup.set(tag, spriteParticles);

        return spriteParticles;
    }

    showParticles(atlasName: string, key: string, obj?: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, 
        particlesNumber = 10, offsetPosition = { x: 0, y: 0 }, timeParticle = 1500): void {
        const positionToEmit = obj ? this.getPositionToEmit(obj, offsetPosition) : offsetPosition;
        const spriteParticles = this._particlesGroup.get(key) || this.createParticles(key, atlasName);
        spriteParticles.lifespan = timeParticle;
        spriteParticles.emitParticle(particlesNumber, positionToEmit.x, positionToEmit.y);
    }

    private getPositionToEmit(obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite, offset: { x: number; y: number }): { x: number; y: number } {
        const worldObj = obj.getWorldTransformMatrix();
        return {
            x: worldObj.tx + offset.x,
            y: worldObj.ty + offset.y,
        };
    }

    addSpriteParticles(){
        if (!this._spriteParticlesGroup) {
            this._spriteParticlesGroup = this._scene.add.group()
		}
    }

    checkSpriteParticlesGroup(){
        if (!this._spriteParticlesGroup) {
            this.addSpriteParticles();
        }
    }

    getSprite(key : string, atlasName? : string) : Phaser.GameObjects.Sprite | Phaser.GameObjects.Image {
        this.checkSpriteParticlesGroup();
        let sprite;
        if (atlasName){
            sprite = this._spriteParticlesGroup.get(0,0,atlasName, key);
        } else {
            sprite = this._spriteParticlesGroup.get(0,0,key);
        }
        sprite.setActive(true);
        sprite.setVisible(true);
        return sprite;
    }

    playWaterEffect(posX : number, posY : number, wavesNumber = 5, wavesDelay = 200) : void{
        this.showParticles('vfx_atlas', 'drop', undefined, 5, {x: posX, y: posY});

        let delay = 0;
        for ( let i = 0; i < wavesNumber; i++) {
            this._scene.time.delayedCall(delay, () => {
                const waterRing = this.getSprite('water_ring', 'vfx_atlas');
                waterRing.setPosition(posX, posY);
                this._tweens.add({
                    targets: waterRing,
                    scale: {from:0, to:2},
                    alpha: {from:1, to:0},
                    duration: 1000,
                    onComplete: () => {
                        this.killSprite(waterRing);
                    }
                })
            });
            delay += wavesDelay;
        }
    }

    private killSprite(sprite : Phaser.GameObjects.Sprite | Phaser.GameObjects.Image){ 
		this._spriteParticlesGroup.killAndHide(sprite);
	}

    scaleUpAndDown(sprite : Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Container, 
        scale : number = 1.5, duration : number = 200, repeat : number = 2, callback? : () => void){
        this._tweens.add({
            targets: sprite,
            scaleX: sprite.scaleX * scale,
            scaleY: sprite.scaleY * scale,
            duration: duration,
            yoyo: true,
            repeat: repeat,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }

    addDisplacement(key : string, value : number, effectDuration : number){
        this._displacementEffect = this._scene.cameras.main.postFX.addDisplacement('water_tile');

        this._tweens.add({
            targets: this._displacementEffect,
            x: {from: value, to: -value},
            y: {from: value, to: -value},
            duration: effectDuration,
            yoyo: true,
            repeat: -1
        })
    }

    stopDisplacement(){
        if (this._displacementEffect) {
            this._scene.cameras.main.postFX.remove(this._displacementEffect);
            this._displacementEffect = null;
        }
    }
}
