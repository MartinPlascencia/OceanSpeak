import Phaser from 'phaser';
import PreloaderIntro from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import Orientation from './libs/Orientation';

let game: Phaser.Game;
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
        /* dom: {
            createContainer: true
        }, */
        powerPreference: 'high-performance',
        disableContextMenu: true
    };

    const orientation = new Orientation();
    orientation.checkOrientation();

    if (orientation.hasCorrectResolution()) {
        game = new Phaser.Game(gameConfig);
    }
    
    window.focus();
};
