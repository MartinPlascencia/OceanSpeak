import Screen from '../utilities/Screen';
import Slider from '../utilities/Slider';
import GameUtils from '../libs/GameUtils';

import sound from '../libs/Sound';

export default class Background extends Phaser.GameObjects.Container {

    private _fade!: Phaser.GameObjects.Rectangle;
    private _frame!: Phaser.GameObjects.Container;
    private _tweens!: Phaser.Tweens.TweenManager;
    private _framePositionY!: number;
    private _numberOfFishes!: number;
    private _fishesSpeed!: number;
    private _numberFishesSliderText!: Phaser.GameObjects.BitmapText;
    private _speedFishesSliderText!: Phaser.GameObjects.BitmapText;
    private _readyCallback!: Function;
    private _gameUtils!: GameUtils;
    private _gameConfig!: any;

    private _titleTextColor = 0xf10000;

    constructor(scene: Phaser.Scene, screen: Screen, callback: Function, gameConfig: any) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this._readyCallback = callback;
        this._tweens = scene.tweens;
        this._gameUtils = new GameUtils(scene);
        this._gameConfig = gameConfig;

        this.createMenu(scene, screen);
        this.setFishesSpeed(Math.round(this._gameConfig.min_fish_speed + this._gameConfig.max_fish_speed / 2));
        this.setNumberOfFishes(Math.round(this._gameConfig.min_fishes_number + this._gameConfig.max_fishes_number / 2));

        this.alpha = 0;
    }

    private createMenu(scene: Phaser.Scene, screen: Screen): void {
        this._fade = scene.add.rectangle(screen.centerX, screen.centerY, screen.width, screen.height, 0x000000);
        this._fade.setAlpha(0);

        this.add(this._fade);

        this._frame = scene.add.container(screen.centerX, screen.centerY);
        this.add(this._frame);
        this._framePositionY = this._frame.y;

        const backgroundFrame = scene.add.image(0, 0, 'game_atlas', 'frame').setScale(1.2);
        this._frame.add(backgroundFrame);

        const titleText = scene.add.bitmapText(0, -backgroundFrame.displayHeight * 0.32, 'grobold_color', 'OCEAN SPEAK', 70)
            .setOrigin(0.5)
            .setLetterSpacing(15);
        titleText.setTint(this._titleTextColor);
        this._frame.add(titleText);

        this.createSliders(scene, backgroundFrame);

        const startButtonContainer = scene.add.container(0, backgroundFrame.displayHeight * 0.5);
        this._frame.add(startButtonContainer);

        const buttonImage = scene.add.image(0, 0, 'game_atlas', 'button').setScale(2);
        startButtonContainer.add(buttonImage);

        const buttonText = scene.add.bitmapText(0, 0, 'grobold', 'START', 60).setOrigin(0.5);
        startButtonContainer.add(buttonText);

        startButtonContainer.setSize(buttonImage.displayWidth, buttonImage.displayHeight);
        startButtonContainer.setInteractive({ useHandCursor: true });
        startButtonContainer.on('pointerdown', () => {
            sound.play('click2');
            this._gameUtils.scaleButton(startButtonContainer, () => {
                startButtonContainer.disableInteractive();
                this.hideMenu();
                this._readyCallback(this._numberOfFishes, this._fishesSpeed);
            });
        });
    }

    private setNumberOfFishes(value: number): void {
        this._numberOfFishes = value;
        this._numberFishesSliderText.setText('Number of Fishes : ' + value);
    }

    private setFishesSpeed(value: number): void {
        this._fishesSpeed = value;
        this._speedFishesSliderText.setText('Speed : ' + value);
    }

    private createSliders(scene: Phaser.Scene, frame: Phaser.GameObjects.Image): void {
        const fishesSlider = new Slider(
            scene,
            this._frame,
            { x: 0, y: -frame.displayHeight * 0.03 },
            frame.displayWidth * 0.6,
            frame.displayHeight * 0.1,
            this._gameConfig.min_fishes_number,
            this._gameConfig.max_fishes_number,
            this.setNumberOfFishes.bind(this)
        );

        this._numberFishesSliderText = scene.add.bitmapText(
            0,
            fishesSlider.y - frame.displayHeight * 0.14,
            'grobold',
            'Number of Fishes : ',
            45
        ).setOrigin(0.5);
        this._frame.add(this._numberFishesSliderText);

        const speedSlider = new Slider(
            scene,
            this._frame,
            { x: 0, y: fishesSlider.y + frame.displayHeight * 0.3 },
            frame.displayWidth * 0.6,
            frame.displayHeight * 0.1,
            this._gameConfig.min_fish_speed,
            this._gameConfig.max_fish_speed,
            this.setFishesSpeed.bind(this)
        );

        const speedSliderText = scene.add.bitmapText(
            0,
            speedSlider.y - frame.displayHeight * 0.14,
            'grobold',
            'Speed : ',
            45
        ).setOrigin(0.5);
        this._frame.add(speedSliderText);
        this._speedFishesSliderText = speedSliderText;
    }

    showMenu(): void {
        sound.play('quick-whoosh');
        this.alpha = 1;
        this._tweens.add({
            targets: this._fade,
            alpha: 0.7,
            duration: 500,
        });
        this._tweens.add({
            targets: this._frame,
            y: { from: -this._framePositionY, to: this._framePositionY },
            duration: 500,
            ease: 'Back.easeOut',
        });
    }

    hideMenu(): void {
        this._tweens.add({
            targets: this._fade,
            alpha: 0,
            duration: 700,
        });
        this._tweens.add({
            targets: this._frame,
            y: -this._framePositionY,
            duration: 500,
            ease: 'Back.easeIn',
        });
    }
}
