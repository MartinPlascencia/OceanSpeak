import Phaser from 'phaser';
import GameUtils from '../libs/GameUtils.js';
import Screen from '../utilities/Screen.js';

import Background from '../helpers/Background';
import Fish from '../helpers/Fish';


const sound = require('../libs/Sound.js');

export default class PreloadScene extends Phaser.Scene {
    private gameUtils!: GameUtils;
    private logo!: Phaser.GameObjects.Image;
    private maskUsed!: Phaser.GameObjects.Graphics & { initialY?: number, endY?: number };
    private startButton!: Phaser.GameObjects.Container;
    private screen!: Screen;

    private fishList: Fish[] = [];
    private fishColors: string[] = ['blue', 'green', 'red', 'orange','brown'];

    constructor() {
        super("MainScene");
    }

    preload() {
        this.gameUtils = new GameUtils(this);
        this.screen = new Screen(this);
    }

    create() {
        
        const background = new Background(this, this.screen);
        this.createFishes();
    }

    private createFishes() {

        for (let i = 0; i < this.fishColors.length; i++) {
            const fish = new Fish(this, {x: Math.random()* this.screen.width, y: Math.random() * this.screen.height}, 'game_atlas', this.fishColors[i], this.screen.height, this.screen.width);
            this.fishList.push(fish);
        }
    }

    update() {
        this.fishList.forEach(fish => {
            fish.move();
        });
    }
}
