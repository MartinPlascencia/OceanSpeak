import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils';
import Screen from '../utilities/Screen';
import Effects from '../utilities/Effects';
import Speech from '../utilities/Speech';

import Background from '../helpers/Background';
import Fish from '../helpers/Fish';
import SetupMenu from '../helpers/SetupMenu';

import gameConfig from '../../assets/data/game_config.json';

import sound from '../libs/Sound'

export default class PreloadScene extends Phaser.Scene {
    private _speech!: Speech;
    private _gameUtils!: GameUtils;
    private _screen!: Screen;
    private _effects!: Effects;
    private _setupMenu!: SetupMenu;
    private _fishContainer!: Phaser.GameObjects.Container;
    private _tiledWater!: Phaser.GameObjects.TileSprite;
    private _displacementEffect!: any;
    private _speechButton!: Phaser.GameObjects.Image;
    private _microphoneIcon!: Phaser.GameObjects.Image;
    private _microphoneTween!: Phaser.Tweens.Tween;

    private _fishColors: string[] = ['blue', 'green', 'red', 'orange','brown', 'purple'];
    private _hexColors = {red: 0xff4f4f, blue: 0x00aeff, orange: 0xff7800, purple: 0xaa46ff, green: 0x00b343, brown: 0xc06105};
    private _displacementEffectValue : number = 0.006;
    private _gameStarted!: boolean;

    constructor() {
        super("MainScene");
        this._gameStarted = false;
        this._speech = new Speech(this.getSpeechText.bind(this));
    }

    preload() : void{

        this._gameUtils = new GameUtils(this);
        this._screen = new Screen(this);
    }

    create() : void {
        
        const background = new Background(this, this._screen);

        this._fishContainer = this.add.container(0, 0);

        this.createEffects();
        this.createMenu();
        this.createSpeechAssets();
        this.animateScene();
    }

    public getSpeechText(text: string) : void{
        text = text.toLowerCase();
        let fishColor: string = '';
        this._fishColors.forEach((color) => {
            if (text.includes(color)) {
                fishColor = color;
            }
        });

        if (fishColor !== '') {
            const fish = this._gameUtils.getClosestToPosition(this._fishContainer.list.filter((fish) => (fish as Fish).getColor() === fishColor) as Phaser.GameObjects.Image[],
                {x: this._screen.centerX, y: this._screen.centerY});
            if (fish) {
                this.fishPressed(fish as Fish);
            }
        }
        this.showSpeechButton();
    }

    showSpeechButton() : void {
        this._speechButton.setInteractive();
        this._speechButton.setScale(0.8);
        this._gameUtils.popObject(this._speechButton);
        this.hideMicrophone();
    }

    private animateScene() : void {   
        this._effects.showFade(350, () => {
            this._speech.speak('Ocean Speak');
            this._setupMenu.showMenu();
        });
    }

    private createMenu(): void {
        this._setupMenu = new SetupMenu(this, this._screen, this.setGame.bind(this), gameConfig);
    }

    private createSpeechAssets() : void {

        const speechButton = this.add.image(0,0, 'game_atlas', 'speak_button');
        speechButton.setPosition(speechButton.displayWidth * 0.5, this._screen.height - speechButton.displayHeight * 0.5);
        speechButton.setScale(0.8).setAlpha(0).setInteractive({useHandCursor: true});
        speechButton.on('pointerdown', () => {
            speechButton.disableInteractive();
            sound.play('click2');
            this._gameUtils.unpopObject(speechButton, 500);
            this.showMicrophone();
            this._speech.speechRecognition();
        });
        this._speechButton = speechButton;

        const microphoneIcon = this.add.image(0,0, 'game_atlas', 'microphone').setAlpha(0);
        const microphoneOffset = microphoneIcon.displayWidth * 0.3;
        microphoneIcon.setPosition(microphoneIcon.displayWidth * 0.5 + microphoneOffset,  
            microphoneIcon.displayHeight * 0.5 + microphoneOffset);
        this._microphoneIcon = microphoneIcon;

        this._microphoneTween = this.add.tween({
            targets: microphoneIcon,
            alpha: {from:0, to: 1},
            duration: 500,
            repeat: -1,
            yoyo: true,
            paused: true
        });

    }

    showMicrophone() : void{
        this._gameUtils.popObject(this._microphoneIcon);
        this._microphoneTween.restart();
    }

    hideMicrophone() : void {
        this._gameUtils.unpopObject(this._microphoneIcon);
        this._microphoneTween.pause();
    }

    setGame(numberOfFishes: number, speed: number) : void {
        this.createFishes(numberOfFishes, speed);
        this._gameStarted = true;
        sound.playSong('dire_dire_docks', {volume: 0.2});
        this.showSpeechButton();
    }

    private createEffects() : void{

        this._effects = new Effects(this);

        this._tiledWater = this.add.tileSprite(this._screen.centerX, this._screen.centerY, this._screen.width, this._screen.height, 'water_tile').setAlpha(0.05);

        this._displacementEffect = this.cameras.main.postFX.addDisplacement('water_tile');

        this.tweens.add({
            targets: this._displacementEffect,
            x: {from: this._displacementEffectValue, to: -this._displacementEffectValue},
            y: {from: this._displacementEffectValue, to: -this._displacementEffectValue},
            duration: 1000,
            yoyo: true,
            repeat: -1
        })

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this._gameStarted) {
                return;
            }
            sound.play('water_attack', {volume: 0.2});
            this._effects.playWaterEffect(pointer.x, pointer.y, 3, 300);
        });

        this._effects.createGroundParticles('bubbles', 'vfx_atlas', 'bubble', -1, true, 450 );
    }

    private createFishes(numberOfFishes: number = 10, speed: number = 5) : void {

        for (let i = 0; i < numberOfFishes; i++) {
            const fish = new Fish(this, {x: Math.random()* this._screen.width, y: Math.random() * this._screen.height}, 'game_atlas', 
                this._fishColors[i % this._fishColors.length], this._screen.height, this._screen.width);
            this._fishContainer.add(fish);
            fish.setSpeed(speed);
            fish.activateInput(true);
            fish.on('pointerdown', this.fishPressed.bind(this, fish));
            this._gameUtils.popObject(fish);
            fish.startMoving();
        }
    }

    private fishPressed(fish: Fish) : void{
        fish.activateInput(false);
        fish.stop();
        sound.play('pop_magic',{volume:0.3});
        sound.play(fish.getColor());
        this._effects.showParticles('vfx_atlas', 'star', fish, 25);
        this._effects.showTextParticles(fish.getColor().toUpperCase(), fish, undefined, 60, this._hexColors[fish.getColor() as keyof typeof this._hexColors], 
            'grobold_color', false, 17);
        this.tweens.add({
            targets: fish,
            scaleX: fish.scaleX * 1.5,
            scaleY: fish.scaleY * 1.5,
            duration: 200,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                fish.activateInput(true);
                fish.startMoving();
            }
        });
    }

    private moveWater() : void{

        this._tiledWater.tilePositionX += 0.5;
        this._tiledWater.tilePositionY += 0.5;
    }

    update() : void {
        (this._fishContainer.list as Fish[]).forEach((fish) => {
            fish.move();
        });
        this.moveWater();
    }
}
