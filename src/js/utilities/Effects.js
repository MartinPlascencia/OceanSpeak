export default class Effects{
    constructor(scene, noParticles = false){        
        
		this.scene = scene;
		this.tweens = scene.tweens;

        if (!noParticles) {
            this.addTextParticles();
            this.particlesGroup = [];
            this.rainParticles = [];
        }
		
        this.createFade();
    }

    addTextParticles(){
        this.textParticles = [];
    }

    createRainParticles(name, atlasName, keys, gravityY, keepPlaying = false, particlesNumber = 150){  
        let particles = this.scene.add.particles(0, 0, atlasName, {
			frame:keys,
            x: { random: [ 0,screen.width ] },
			y:-200,
            lifespan: 3500,
            gravityY: gravityY,
            frequency: particlesNumber,
            scale: { min: 0.3, max: 0.8 },
			angle: { min: 0, max: 360 },
			rotate:{start:0,end:450},
			accelerationY:{min:100,max:300},
			speedX:{min:-100,max:100},
        });
        particles.tag = name;
        if (keepPlaying) {
            particles.start();
        } else {
            particles.stop();
        }
        this.rainParticles.push(particles);
    }

    startRainParticles(name){
        let particles = this.rainParticles.find(particle => particle.tag == name);
        if (particles) {
            particles.start();
        }
    } 
    
    stopRainParticles(name){
        let particles = this.rainParticles.find(particle => particle.tag == name);
        if (particles) {
            particles.stop();
        }
    }

    createTextParticle(font){
        var textParticle = this.scene.add.bitmapText(0, 0, font, '0', 18);
        textParticle.setOrigin(0.5);
        textParticle.alpha = 0;
        textParticle.setCenterAlign();
        this.textParticles.push(textParticle);
        return textParticle;
    }

    createFade(){
        this.whiteFade = this.scene.add.rectangle(screen.centerX,screen.centerY,screen.width,screen.height,0xffffff).setAlpha(0);
        this.whiteFade.setBlendMode(Phaser.BlendModes.ADD);
        this.whiteFade.setScrollFactor(0,0);
    }

    showFade(duration = 350, callback = null){
        this.whiteFade.alpha = 1;
        this.tweens.add({
            targets:this.whiteFade, 
            alpha:0, 
            duration:duration,
            onComplete:callback,
        })
    }

    fadeOut(duration = 350, callback = null){
        this.whiteFade.alpha = 0;
        this.tweens.add({
            targets:this.whiteFade, 
            alpha:1, 
            duration:duration,
            onComplete:callback,
        })
    }

    createParticles(tag, atlasName, ignoreGravity){       
        let particleConfig = {
            frame:tag,
            speed: {min: -400, max: 400 },
            angle: {min: 0, max: 360 },
            //scale: {min:1, max:3},
            scale: {start:3, end:0},
            alpha: {start:1, end:0},
            maxParticles:200,
            emitting:false,
            gravityY:300,
            //blendMode: 'SCREEN',
            rotate:{min:180, max:360},
        }
        if (ignoreGravity) {
            particleConfig.gravityY = 0;
		}
        let spriteParticles = this.scene.add.particles(0, 0, atlasName, particleConfig);
        spriteParticles.tag = tag;
        this.particlesGroup.push(spriteParticles);
        return spriteParticles;
    }
         
    showParticles(atlasName, key, obj, particlesNumber = 10, offsetPosition = {x:0, y:0}, timeParticle = 1500){      
        var positionToEmit = this.getPositionToEmit(obj, offsetPosition)
        let spriteParticles = this.particlesGroup.find(particle => particle.tag == key);
        if (!spriteParticles) {
            spriteParticles = this.createParticles(key, atlasName);
        }
		spriteParticles.lifeSpan = timeParticle;
		spriteParticles.emitParticle(particlesNumber,positionToEmit.x, positionToEmit.y);
    }

    addSpriteParticles(){
        if (!this.spriteParticlesGroup) {
            this.spriteParticlesGroup = this.scene.add.group()
		}
    }

    showSpriteParticles(animName, obj, scaleToUse = 1, frames = 12, offsetPosition = {x:0, y:0}, keepAnimation){

        if (!this.spriteParticlesGroup) {
            this.addSpriteParticles();
		}
        var anim = this.spriteParticlesGroup.get(0,0,animName);
        if (!anim) {
            console.log("sprite sheet particle " + animName + " has not been created")
            return
        }
        if (obj) {
            this.positionObject(anim, obj, offsetPosition);
        }
        anim.setActive(true);
        anim.setVisible(true);
        anim.setScale(scaleToUse)
        anim.play({key: animName, repeat:keepAnimation?-1:0});
        if (!keepAnimation){
            anim.once('animationcomplete',() => {
				this.killSprite(anim);
			});
        }

        return anim;
    }

    positionObject(asset, obj,offset){
        let worldObj = obj.getWorldTransformMatrix()
        asset.x = worldObj.tx + offset.x;
        asset.y = worldObj.ty + offset.y;
    }

	getPositionToEmit(obj, offset = {x:0, y:0}){

        let worldObj = obj.getWorldTransformMatrix()
        let positionToEmit = {}
        positionToEmit.x = worldObj.tx + offset.x
        positionToEmit.y = worldObj.ty + offset.y
        return positionToEmit
    }

	killSprite(sprite){
		this.spriteParticlesGroup.killAndHide(sprite);
	}

	showTextParticles(text, obj, offsetPosition = {x:0, y:0}, fontSize = 55, tint = 0xffffff, font, dontMove){
        let particleText = this.textParticles.find(particle => particle.alpha == 0);
        if (!particleText) {
            particleText = this.createTextParticle(font)
        }
        this.positionObject(particleText, obj, offsetPosition);
        particleText.fontSize = fontSize;
        particleText.alpha = 1;
        particleText.text = text;
        particleText.tint = tint;
        this.tweens.add({targets:particleText, alpha:0, duration:500, delay:500})
        if (!dontMove) {
			this.tweens.add({targets:particleText, y:particleText.y - 100, duration:1000})
		}  
    }

	shakeCamera(duration = 200, intensity = 0.005){
		this.scene.cameras.main.shake(duration, intensity);
	}

    damageTargetEffect(target){
        let offsetY = -target.getBounds().height * 0.1;
        if(target.damagePoints) {
            this.showTextParticles("-" + target.damagePoints.toFixed(1), target, {x:0, y:offsetY}, 40, 0xffffff, "unispace_regular");
        } else {
            this.showTextParticles("MISS", target, {x:0, y:offsetY}, 40, 0xffffff, "unispace_regular");
        }
        //this.showParticles("vfx_atlas","star",target,10,{x:0,y:offsetY});
        //this.showFade(200);
        this.shakeCamera();
    }

    changeTimeScale(timeScale){
        this.scene.time.timeScale = timeScale;
        this.scene.tweens.timeScale = timeScale;
    }

    createEffectsAnimation(characterName, effectsList){
        effectsList.forEach((effect) => {
            if (!this.scene.anims.exists(characterName + "_" + effect.name)) {
                this.scene.anims.create({
                    key: characterName + "_" + effect.name,
                    frames: this.scene.anims.generateFrameNames('vfx_atlas', {start: effect.frames.start, end: effect.frames.end, 
                        zeroPad: 2, prefix: effect.key}),
                    frameRate: effect.frameRate,
                    repeat: 0
                });
            }
        });
    }
}