const sound = require('../libs/Sound.js');
export default class Slider extends Phaser.GameObjects.Container {
    constructor(scene, container, position, width, height, minValue, maxValue, callback){ 
        super(scene, position.x, position.y);
        this.minValue = minValue;
        this.maxValue = maxValue;

        this.isDragging = false;
        this.callback = callback;

        this.sliderLine = null;
        
        container.add(this);
        this.createSlider(scene, width, height);
    }

    activateSlider(active) {
        active ? this.sliderLine.setInteractive() : this.sliderLine.disableInteractive();
    }

    createSlider(scene, width, height){

		let sliderLine = scene.add.rectangle(0, 0, width * 1.2, height * 2, 0x000000);
		sliderLine.alpha = 0.01;
        sliderLine.setInteractive();
        this.add(sliderLine);
        this.sliderLine = sliderLine;

        let backgroundLine = scene.add.rectangle(0, 0, width, height, 0x000000);
        backgroundLine.alpha = 0.5;
        this.add(backgroundLine);

        const initialX = backgroundLine.x - backgroundLine.width/2;
        const finalX = backgroundLine.x + backgroundLine.width/2;

		let dragButton = scene.add.circle(sliderLine.x, sliderLine.y , 50, 0xffffff);
		this.add(dragButton);

        let initialPositionX;

        const positionDragButton = (pointer) => {
            let posX = pointer.x - initialPositionX;

            if (posX < initialX) {
                posX = initialX;
            } else if (posX > finalX) {
                posX = finalX;
            }
            dragButton.x = posX;
        };
        sliderLine.on('pointerdown', (pointer) => {
            initialPositionX = sliderLine.getWorldTransformMatrix().tx
            this.isDragging = true;
            dragButton.setScale(1.2);
            positionDragButton(pointer);
            sound.play('drag');

        });

        const sendValue = () =>{
            const sliderValue = (dragButton.x - initialX) / (finalX - initialX);
            const value = this.minValue + (sliderValue * (this.maxValue - this.minValue));
            this.callback(Math.round(value));
        }

        const stopDrag = () =>{
            this.isDragging = false;
            dragButton.setScale(1);
            sound.play('pop');
        }

        sliderLine.on('pointerup', stopDrag);
        sliderLine.on('pointerout', stopDrag);
        sliderLine.on('pointerupoutside', stopDrag);

        sliderLine.on('pointermove', (pointer) => {
            if (this.isDragging) {
                positionDragButton(pointer);
                sendValue();
            }
        });

    }
}