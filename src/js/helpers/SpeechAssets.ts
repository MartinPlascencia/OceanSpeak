import Speech from "../utilities/Speech";
import sound from '../libs/Sound'
import GameUtils from "../libs/GameUtils";
import Screen from "../utilities/Screen";
export default class Background extends Phaser.GameObjects.Container {

    private _speech!: Speech;
    private _speechButton!: Phaser.GameObjects.Image;
    private _microphoneIcon!: Phaser.GameObjects.Image;
    private _microphoneTween!: Phaser.Tweens.Tween;
    private _gameUtils!: GameUtils;
    constructor(scene: Phaser.Scene, screen : Screen, callback: (text: string) => void) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this._speech = new Speech((text : string) =>{
            this.showSpeechButton();
            callback(text);
        });

        this._gameUtils = new GameUtils(scene);
        this.createSpeechAssets(scene, screen);
        this.showSpeechButton();
    }

    private createSpeechAssets(scene : Phaser.Scene, screen : Screen) : void {

        const speechButton = scene.add.image(0,0, 'game_atlas', 'speak_button');
        speechButton.setPosition(speechButton.displayWidth * 0.5, screen.height - speechButton.displayHeight * 0.5);
        speechButton.setScale(0.8).setAlpha(0).setInteractive({useHandCursor: true});
        speechButton.on('pointerdown', () => {
            speechButton.disableInteractive();
            sound.play('click2');
            this._gameUtils.unpopObject(speechButton, 500);
            this.showMicrophone();
            this._speech.speechRecognition();
        });
        this._speechButton = speechButton;
        this.add(speechButton);

        const microphoneIcon = scene.add.image(0,0, 'game_atlas', 'microphone').setAlpha(0);
        const microphoneOffset = microphoneIcon.displayWidth * 0.3;
        microphoneIcon.setPosition(microphoneIcon.displayWidth * 0.5 + microphoneOffset,  
            microphoneIcon.displayHeight * 0.5 + microphoneOffset);
        this._microphoneIcon = microphoneIcon;
        this.add(microphoneIcon);

        this._microphoneTween = scene.add.tween({
            targets: microphoneIcon,
            alpha: {from:0, to: 1},
            duration: 500,
            repeat: -1,
            yoyo: true,
            paused: true
        });
    }

    private showMicrophone() : void{
        this._gameUtils.popObject(this._microphoneIcon);
        this._microphoneTween.restart();
    }

    private hideMicrophone() : void {
        this._gameUtils.unpopObject(this._microphoneIcon);
        this._microphoneTween.pause();
    }

    private showSpeechButton() : void {
        this._speechButton.setInteractive();
        this._speechButton.setScale(0.8);
        this._gameUtils.popObject(this._speechButton);
        this.hideMicrophone();
    }

}