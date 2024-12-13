import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils.js';
import Screen from '../utilities/Screen.js';
import Effects from '../utilities/Effects.js';

import Background from '../helpers/Background';
import Fish from '../helpers/Fish';
import SetupMenu from '../helpers/SetupMenu';

import gameConfig from '../../assets/data/game_config.json';

const sound = require('../libs/Sound.js');

export default class PreloadScene extends Phaser.Scene {
    private gameUtils!: GameUtils;
    private logo!: Phaser.GameObjects.Image;
    private maskUsed!: Phaser.GameObjects.Graphics & { initialY?: number, endY?: number };
    private startButton!: Phaser.GameObjects.Container;
    private screen!: Screen;
    private effects!: Effects;
    private setupMenu!: SetupMenu;
    private _fishContainer!: Phaser.GameObjects.Container;
    private _tiledWater!: Phaser.GameObjects.TileSprite;
    private _displacementEffect!: any;
    private _gameStarted!: boolean;

    private fishColors: string[] = ['blue', 'green', 'red', 'orange','brown', 'purple'];
    private hexColors = {red: 0xff4f4f, blue: 0x00aeff, orange: 0xff7800, purple: 0xaa46ff, green: 0x00b343, brown: 0xc06105};

    constructor() {
        super("MainScene");
        this._gameStarted = false;
    }

    preload() {
        this.gameUtils = new GameUtils(this);
        this.screen = new Screen(this);
    }

    create() {
        
        const background = new Background(this, this.screen);

        this._fishContainer = this.add.container(0, 0);

        this.createEffects();

        this.createMenu();
    }

    private createMenu() {
        this.setupMenu = new SetupMenu(this, this.screen, this.setGame.bind(this), gameConfig);
        this.setupMenu.showMenu();
    }

    setGame(numberOfFishes: number, speed: number) {
        this.createFishes(numberOfFishes, speed);
        this._gameStarted = true;
        sound.playSong('dire_dire_docks', {volume: 0.2});
    }

    createEffects(){

        this.effects = new Effects(this);

        this._tiledWater = this.add.tileSprite(this.screen.centerX, this.screen.centerY, this.screen.width, this.screen.height, 'water_tile').setAlpha(0.05);

        this._displacementEffect = this.cameras.main.postFX.addDisplacement('water_tile');

        this.tweens.add({
            targets: this._displacementEffect,
            x: {from: 0.006, to: -0.006},
            y: {from: 0.006, to: -0.006},
            duration: 1000,
            yoyo: true,
            repeat: -1
        })

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this._gameStarted) {
                return;
            }
            sound.play('water_attack', {volume: 0.2});
            this.effects.showParticles('vfx_atlas', 'drop', null, 5, {x: pointer.x, y: pointer.y});
        });
    }

    private createFishes(numberOfFishes: number = 10, speed: number = 5) {

        let fishIndex = 0;
        for (let i = 0; i < numberOfFishes; i++) {
            const fish = new Fish(this, {x: Math.random()* this.screen.width, y: Math.random() * this.screen.height}, 'game_atlas', this.fishColors[fishIndex], 
                this.screen.height, this.screen.width);
            this._fishContainer.add(fish);
            fish.setSpeed(speed);
            fish.setInteractive();
            fish.on('pointerdown', this.fishPressed.bind(this, fish));

            fishIndex++;
            if (fishIndex >= this.fishColors.length) {
                fishIndex = 0;
            }
            this.gameUtils.popObject(fish);
            fish.startMoving();
        }
    }

    private fishPressed(fish: Fish) {
        fish.activateInput(false);
        fish.stop();
        sound.play('pop_magic',{volume:0.3});
        sound.play(fish.getColor());
        this.effects.showParticles('vfx_atlas', 'star', fish, 25);
        this.effects.showTextParticles(fish.getColor().toUpperCase(), fish, undefined, 60, this.hexColors[fish.getColor() as keyof typeof this.hexColors], 'grobold_color', undefined, 17);
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

    private moveWater() {

        this._tiledWater.tilePositionX += 0.5;
        this._tiledWater.tilePositionY += 0.5;
    }

    update() {
        (this._fishContainer.list as Fish[]).forEach((fish) => {
            fish.move();
        });
        this.moveWater();
    }
}
