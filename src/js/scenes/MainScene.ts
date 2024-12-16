import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils';
import Screen from '../utilities/Screen';
import Effects from '../utilities/Effects';

import Background from '../helpers/Background';
import Fish from '../helpers/Fish';
import SetupMenu from '../helpers/SetupMenu';
import SpeechAssets from '../helpers/SpeechAssets';
import MovingTileSprite from '../helpers/MovingTileSprite';

import gameConfig from '../../assets/data/game_config.json';

import sound from '../libs/Sound'
import ColorInteractiveAsset from '../helpers/ColorInteractiveAsset';

export default class PreloadScene extends Phaser.Scene {
    private _gameUtils!: GameUtils;
    private _screen!: Screen;
    private _effects!: Effects;
    private _setupMenu!: SetupMenu;
    private _fishContainer!: Phaser.GameObjects.Container;
    private _tiledWater!: MovingTileSprite;

    private _background! : Background;

    private _fishColors: string[] = ['blue', 'green', 'red', 'orange','brown', 'purple'];
    private _hexColors = {red: 0xff4f4f, blue: 0x00aeff, orange: 0xff7800, purple: 0xaa46ff, green: 0x00b343, brown: 0xc06105};
    private _gameStarted!: boolean;
    private _shouldMoveWater : boolean = false;

    constructor() {
        super("MainScene");
        this._gameStarted = false;
    }

    preload() : void{

        this._gameUtils = new GameUtils(this);
        this._screen = new Screen(this);
    }

    create() : void {
        
        this._background = new Background(this, this._screen);

        this._fishContainer = this.add.container(0, 0);

        this.createEffects();
        this.createMenu();
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
    }

    private animateScene() : void {   
        this._shouldMoveWater = true;
        this._effects.showFade(350, () => {
            this._setupMenu.showMenu();
        });
    }

    private createMenu(): void {
        this._setupMenu = new SetupMenu(this, this._screen, this.setGame.bind(this), gameConfig);
    }

    private createSpeechAssets() : void {
        new SpeechAssets(this, this._screen, this.getSpeechText.bind(this));
    }

    private setInteractivePlants() : void {
        this._background.getPlants().forEach((plant) => {
            plant.activateInput(true);
            plant.addInputCallback(() => {
                this.pressColoredAsset(plant);
            });
        });
    }

    setGame(numberOfFishes: number, speed: number) : void {
        this.createFishes(numberOfFishes, speed);
        this.setInteractivePlants();
        this._gameStarted = true;
        sound.playSong('dire_dire_docks', {volume: 0.2});
        this.createSpeechAssets();
    }

    private createEffects() : void{

        this._effects = new Effects(this);

        this._tiledWater = new MovingTileSprite(this, 0, 0, this._screen.width, this._screen.height, 'water_tile', 0.5, 0.5).setOrigin(0, 0)
        .setAlpha(0.1);

        this._effects.addDisplacement('water_tile', gameConfig.displacement_effect_value, 1000);

        this.input.on('pointerdown', this.handlePointerDown.bind(this));
        this._effects.createGroundParticles('bubbles', 'vfx_atlas', 'bubble', -1, true, 450 );
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        if (!this._gameStarted) return;
        sound.play('water_attack', {volume: 0.2});
        this._effects.playWaterEffect(pointer.x, pointer.y, 3, 300);
    }

    private createFishes(numberOfFishes: number = 10, speed: number = 5) : void {

        for (let i = 0; i < numberOfFishes; i++) {
            const fish = new Fish(this, {x: Math.random()* this._screen.width, y: Math.random() * this._screen.height}, 'game_atlas', 
                this._fishColors[i % this._fishColors.length], this._screen.height, this._screen.width);
            this._fishContainer.add(fish);
            fish.setSpeed(speed);
            fish.activateInput(true);
            fish.addInputCallback(this.fishPressed.bind(this));
            this._gameUtils.popObject(fish);
            fish.startMoving();
        }
    }

    private fishPressed(fish: Fish) : void{
        fish.stop();
        this.pressColoredAsset(fish, () => {
            fish.startMoving();
        });
    }

    private pressColoredAsset(asset: ColorInteractiveAsset, callback? : () => void) : void {
        asset.activateInput(false);
        sound.play('pop_magic',{volume:0.3});
        sound.play(asset.getColor());
        this._effects.showParticles('vfx_atlas', 'star', asset, 25);
        this._effects.showTextParticles(asset.getColor().toUpperCase(), asset, undefined, 60, this._hexColors[asset.getColor() as keyof typeof this._hexColors], 
            'grobold_color', false, 17);
        this._effects.scaleUpAndDown(asset, 1.5, 200, 2, () => { 
            asset.activateInput(true);
            if (callback) {
                callback();
            }
        });
    }

    update() : void {
        this._fishContainer.list.forEach((fish) => {
            if (fish instanceof Fish) {
                fish.move();
            }
        });
        if (this._shouldMoveWater) {
            this._tiledWater.move();
        }
    }

    shutdown() : void { 
        if (this._effects) {
            this._effects.stopDisplacement();
        }
    }
}
