import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils';
import SceneLoader from '../libs/Sceneloader';
import Effects from '../utilities/Effects';

import assetsData from '../../assets/data/assets.json';
import gameConfig from '../../assets/data/game_config.json';

import sound from '../libs/Sound';
import Screen from '../utilities/Screen';


export default class PreloadScene extends Phaser.Scene {
    private _gameUtils!: GameUtils;
    private _sceneloader!: SceneLoader;
    private _logo!: Phaser.GameObjects.Image;
    private _maskUsed!: Phaser.GameObjects.Graphics & { initialY?: number, endY?: number };
    private _startButton!: Phaser.GameObjects.Container;
    private _screen!: Screen;
    private _effects!: Effects;

    constructor() {
        super("PreloadScene");
    }

    private updateLoadingBar = (event: { progress: number }): void => {
        if (this._logo) {
            const loadingStep = event.progress * this._logo.displayHeight;
            const mask = this._maskUsed;
            if (mask.initialY !== undefined) {
                mask.y = mask.initialY - loadingStep;
            }
        }
    };

    private goToGame(): void {
        sound.decode(assetsData.game.assets.sounds_list, this);
        this._effects.fadeOut(400, () => {
            this.scene.start(gameConfig.scene_to_start);
        });
    }

    private onCompleteLoading = (): void => {
        if (gameConfig.skip_loading) {
            this.time.delayedCall(150, () => {
                this.goToGame();
            });
        } else {
            this.tweens.add({
                targets: this._startButton,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                    this._startButton.setInteractive();
                }
            });
        }
    };

    preload(): void {
        this._gameUtils = new GameUtils(this);

        this._sceneloader = new SceneLoader(this);
        this._sceneloader.preload(assetsData.preload);

        this._screen = new Screen(this);
    }

    create(): void {
        sound.decode(assetsData.preload.assets.sounds_list, this);

        const background = this.add.rectangle(
            this._screen.centerX,
            this._screen.centerY,
            this._screen.width,
            this._screen.height,
            0x33067a
        );

        const companyLogo = this.add.image(this._screen.centerX, this._screen.centerY + 85, 'loadingAtlas', 'logoWarbler');

        const logo = this.add.image(this._screen.centerX, this._screen.centerY - 150, 'loadingAtlas', 'wIcon');

        const topLogo = this.add.image(logo.x, logo.y, 'loadingAtlas', 'wIcon2');
        this._logo = topLogo;

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
        this._maskUsed = mask;
        mask.alpha = 0;

        const maskRect = mask.createGeometryMask();
        topLogo.setMask(maskRect);

        const buttonContainer = this.add.container(this._screen.centerX, companyLogo.y + 165);
        buttonContainer.alpha = 0;
        this._startButton = buttonContainer;

        const btnActive = this.add.sprite(0, 0, 'loadingAtlas', 'startBtn');
        btnActive.setOrigin(0.5);
        buttonContainer.add(btnActive);

        buttonContainer.on('pointerdown', () => {
            sound.play("load_button");
            buttonContainer.disableInteractive();
            this._gameUtils.scaleButton(buttonContainer, this.goToGame.bind(this), true);
        }, this);

        buttonContainer.setSize(btnActive.width, btnActive.height);

        const buttonText = this.add.bitmapText(0, 3, 'futura_bold', 'Start Game', 35, 1).setOrigin(0.5).setTint(0x7f1111);
        buttonContainer.add(buttonText);

        this._sceneloader.preload(assetsData.game, {
            onLoadFile: this.updateLoadingBar,
            onComplete: this.onCompleteLoading
        });

        this._effects = new Effects(this);
    }
}
