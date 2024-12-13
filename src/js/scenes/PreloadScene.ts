import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils.js';
import SceneLoader from '../libs/Sceneloader.js';
import Screen from '../utilities/Screen.js';
import Effects from '../utilities/Effects.js';

import assetsData from '../../assets/data/assets.json';
import gameConfig from '../../assets/data/game_config.json';

const sound = require('../libs/Sound.js');

export default class PreloadScene extends Phaser.Scene {
    private gameUtils!: GameUtils;
    private sceneloader!: SceneLoader;
    private logo!: Phaser.GameObjects.Image;
    private maskUsed!: Phaser.GameObjects.Graphics & { initialY?: number, endY?: number };
    private startButton!: Phaser.GameObjects.Container;
    private screen!: Screen;
    private effects!: Effects;

    constructor() {
        super("PreloadScene");
    }

    private updateLoadingBar = (event: { progress: number }) => {
        if (this.logo) {
            const loadingStep = event.progress * this.logo.displayHeight;
            const mask = this.maskUsed;
            if (mask.initialY !== undefined) {
                mask.y = mask.initialY - loadingStep;
            }
        }
    };

    private goToGame(){
        sound.decode(assetsData.game.assets.sounds_list, this);
        this.effects.fadeOut(300, () => {
            this.scene.start(gameConfig.scene_to_start);
        });
    }

    private onCompleteLoading = () => {
        if (gameConfig.skip_loading) {
            this.time.delayedCall(150, () => {
                this.goToGame();
            });
        } else {
            this.tweens.add({
                targets: this.startButton,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                    this.startButton.setInteractive();
                }
            });
        }
    };

    preload() {
        this.gameUtils = new GameUtils(this);

        this.sceneloader = new SceneLoader(this);
        this.sceneloader.preload(assetsData.preload);

        this.screen = new Screen(this);
    }

    create() {

        sound.decode(assetsData.preload.assets.sounds_list, this);
        const background = this.add.rectangle(this.screen.centerX, this.screen.centerY, this.screen.width, this.screen.height, 0x33067a);

        const companyLogo = this.add.image(this.screen.centerX, this.screen.centerY + 85, 'loadingAtlas', 'logoWarbler');

        const logo = this.add.image(this.screen.centerX, this.screen.centerY - 150, 'loadingAtlas', 'wIcon');
        const topLogo = this.add.image(logo.x, logo.y, 'loadingAtlas', 'wIcon2');
        this.logo = topLogo;

        const mask = this.add.graphics() as Phaser.GameObjects.Graphics & { initialY?: number, endY?: number };
        mask.fillStyle(0xffffff);
        mask.beginPath();
        mask.fillRect(
            topLogo.x - topLogo.displayWidth * 0.5,
            topLogo.y + topLogo.displayHeight * 0.5,
            topLogo.displayWidth,
            topLogo.displayHeight
        );
        mask.initialY = mask.y;
        mask.endY = mask.initialY - topLogo.displayHeight;
        this.maskUsed = mask;
        mask.alpha = 0;

        const maskRect = mask.createGeometryMask();
        topLogo.setMask(maskRect);

        const buttonContainer = this.add.container(this.screen.centerX, companyLogo.y + 165);
        buttonContainer.alpha = 0;
        this.startButton = buttonContainer;

        const btnActive = this.add.sprite(0, 0, 'loadingAtlas', 'startBtn');
        btnActive.setOrigin(0.5);
        buttonContainer.add(btnActive);
        buttonContainer.on('pointerdown', () => {
            sound.play("load_button");
            buttonContainer.disableInteractive();
            this.gameUtils.scaleButton(buttonContainer, () => {
                this.goToGame();
            });
        }, this);
        buttonContainer.setSize(btnActive.width, btnActive.height);

        const buttonText = this.add.bitmapText(0, 3, 'futura_bold', 'Start Game', 35, 1).setOrigin(0.5).setTint(0x7f1111);
        buttonContainer.add(buttonText);

        this.sceneloader.preload(assetsData.game, {
            onLoadFile: this.updateLoadingBar,
            onComplete: this.onCompleteLoading
        });

        this.effects = new Effects(this);
    }
}
