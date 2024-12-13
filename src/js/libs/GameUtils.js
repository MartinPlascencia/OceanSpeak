
export default class GameUtils {
    constructor(game) {
        this.game = game;
        this.desktop = game.sys.game.device.os.desktop;
        this.createWarning();
    }

    createWarning() {
        
        this.warning = this.game.add.container(screen.centerX, screen.centerY);
        this.warning.setDepth(999999);
        this.warning.setAlpha(0);

        let warningBackground = this.game.add.rectangle(0, 0, screen.width * 0.4, screen.width * 0.4, 0x000000);
        warningBackground.setOrigin(0.5);
        this.warning.add(warningBackground);

        let warningText = this.game.add.text(0, 0, 'Warning Text', {
            font: '38px Arial',    // Font size and family
            fill: '#ffffff',       // Text color
            stroke: '#000000',     // Outline color
            strokeThickness: 4,    // Outline thickness
            align: 'center'        // Alignment
        }).setOrigin(0.5);
        this.warning.add(warningText);
        this.warning.warningText = warningText;

    }

    showWarning(text,duration) {
        this.warning.warningText.setText(this.addNewlines(text, 20));
        this.warning.setAlpha(1);
        this.game.tweens.add({
            targets: this.warning,
            scale:{from:0,to:1},
            duration: 300,
            ease: 'Back.easeOut',
        })
        if (duration) {
            this.game.time.delayedCall(duration,()=>{
                this.game.tweens.add({
                    targets: this.warning,
                    alpha:0,
                    duration: 300,
                })
            });
        }
    }

    addNewlines(text, maxLineLength) {
        let lines = [];
        let currentLine = '';
    
        text.split(' ').forEach(word => {
            if ((currentLine + word).length > maxLineLength) {
                lines.push(currentLine.trim());
                currentLine = '';
            }
            currentLine += word + ' ';
        });
    
        if (currentLine) {
            lines.push(currentLine.trim());
        }
    
        return lines.join('\n');
    }

    addCloseCallback() {
        window.addEventListener("beforeunload", () => {
            this.saveLocalData();
        });
    }

    getPositionToEmit(obj, offset = { x: 0, y: 0 }) {
        const worldObj = obj.getWorldTransformMatrix();
        return {
            x: worldObj.tx + offset.x,
            y: worldObj.ty + offset.y,
        };
    }

    scaleButton(obj, callback, style) {
        if (!obj) return;

        if (!style) {
            const scale1 = obj.scaleX * 0.7;
            const scale2 = obj.scaleX * 0.9;

            this.game.tweens.add({
                targets: obj,
                scale: scale1,
                duration: 150,
                onComplete: () => {
                    this.game.tweens.add({
                        targets: obj,
                        scale: scale2,
                        duration: 50,
                        repeat: 0,
                        yoyo: true,
                        onComplete: callback,
                    });
                },
                repeat: 0,
                yoyo: true,
            });
        } else {
            const scaleX = obj.scaleX;
            const scaleY = obj.scaleY;

            this.game.tweens.add({
                targets: obj,
                scaleX: scaleX * 0.5,
                scaleY: scaleY * 1.8,
                duration: 150,
                onComplete: () => {
                    this.game.tweens.add({
                        targets: obj,
                        scaleX: scaleX * 2,
                        scaleY: 0,
                        duration: 100,
                        onComplete: callback,
                    });
                },
            });
        }
    }

    popObject(obj) {
        this.game.tweens.add({
            targets: obj,
            scaleX: {from:0, to:obj.scaleX},
            scaleY: {from:0, to:obj.scaleY},
            duration: 300,
            ease: 'Back.easeOut',
        })
    }

    getImageWidth(id, atlas) {
        if (atlas) {
            return this.game.textures.getFrame(atlas, id).width;
        } else {
            return this.game.textures.getFrame(id).width;
        }
    }

    isDesktop() {
        return this.desktop;
    }

    activateScreenButtons(buttonList, active) {
        buttonList.forEach((button) => {
            active ? button.setInteractive() : button.disableInteractive();
        });
    }

    toDecimals(number, decimals) {
        if (typeof number !== 'number') {
            number = Number(number);
        }
        return number % 1 !== 0 ? number.toFixed(decimals) : number;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
