import Phaser from 'phaser';
import PreloaderIntro from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import Screen from './utilities/Screen';
import Orientation from './libs/Orientation';

import SliderPlugin from 'phaser3-rex-plugins/plugins/slider-plugin.js';

let game: Phaser.Game;
let screen = null;
const gameWidth = 1920;
const gameHeight = Math.round(gameWidth * (window.innerHeight / window.innerWidth));

window.onload = () => {
    const gameConfig: Phaser.Types.Core.GameConfig = {
        backgroundColor: "#000000",
        scene: [PreloaderIntro, MainScene],
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: gameWidth,
            height: gameHeight,
        },
        fps: {
            target: 60,
            forceSetTimeOut: true
        },
        dom: {
            createContainer: true
        },
        plugins: {
            global: [{
                key: 'rexSlider',
                plugin: SliderPlugin,
                start: true
            },
            // ...
            ]
        },
        powerPreference: 'high-performance',
        disableContextMenu: false
    };

    game = new Phaser.Game(gameConfig);

    const orientation = new Orientation();
    orientation.checkOrientation();
    window.focus();
};
