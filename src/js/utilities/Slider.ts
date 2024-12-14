import Sound from '../libs/Sound';

export default class Slider extends Phaser.GameObjects.Container {
    private _minValue: number;
    private _maxValue: number;
    private _isDragging: boolean;
    private _callback: (value: number) => void;
    private _sliderLine: Phaser.GameObjects.Rectangle | null;

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container, position: Phaser.Types.Math.Vector2Like,
        width: number, height: number, minValue: number, maxValue: number, callback: (value: number) => void) {
        super(scene, position.x, position.y);

        this._minValue = minValue;
        this._maxValue = maxValue;
        this._isDragging = false;
        this._callback = callback;
        this._sliderLine = null;

        container.add(this);
        this.createSlider(scene, width, height);
    }

    public activateSlider(active: boolean): void {
        active ? this._sliderLine?.setInteractive() : this._sliderLine?.disableInteractive();
    }

    private createSlider(scene: Phaser.Scene, width: number, height: number): void {
        
        const sliderLine = scene.add.rectangle(0, 0, width * 1.2, height * 2, 0x000000);
        sliderLine.alpha = 0.01;
        sliderLine.setInteractive();
        this.add(sliderLine);
        this._sliderLine = sliderLine;

        const backgroundLine = scene.add.rectangle(0, 0, width, height, 0x000000);
        backgroundLine.alpha = 0.5;
        this.add(backgroundLine);

        const initialX = backgroundLine.x - backgroundLine.width / 2;
        const finalX = backgroundLine.x + backgroundLine.width / 2;

        const dragButton = scene.add.circle(sliderLine.x, sliderLine.y, 50, 0xffffff);
        this.add(dragButton);

        let initialPositionX: number;
        let sliderStarted = false;

        const positionDragButton = (pointer: Phaser.Input.Pointer): void => {
            let posX = pointer.x - initialPositionX;

            if (posX < initialX) {
                posX = initialX;
            } else if (posX > finalX) {
                posX = finalX;
            }

            dragButton.x = posX;
        };

        const sendValue = (): void => {
            const sliderValue = (dragButton.x - initialX) / (finalX - initialX);
            const value = this._minValue + sliderValue * (this._maxValue - this._minValue);
            this._callback(Math.round(value));
        };

        const stopDrag = (): void => {
            this._isDragging = false;
            dragButton.setScale(1);
            if (sliderStarted) {
                Sound.play('pop');
            }
            sliderStarted = false;
        };

        sliderLine.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            initialPositionX = sliderLine.getWorldTransformMatrix().tx;
            this._isDragging = true;
            dragButton.setScale(1.2);
            positionDragButton(pointer);
            Sound.play('drag');
            sliderStarted = true;
        });

        sliderLine.on('pointerup', stopDrag);
        sliderLine.on('pointerout', stopDrag);
        sliderLine.on('pointerupoutside', stopDrag);

        sliderLine.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this._isDragging) {
                positionDragButton(pointer);
                sendValue();
            }
        });
    }
}
