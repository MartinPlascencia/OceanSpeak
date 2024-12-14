export default class GameUtils {
    private game: Phaser.Scene;

    constructor(game: Phaser.Scene) {
        this.game = game;
    }

    getPositionToEmit(obj: any, offset: { x: number; y: number } = { x: 0, y: 0 }): { x: number; y: number } {
        const worldObj = obj.getWorldTransformMatrix();
        return {
            x: worldObj.tx + offset.x,
            y: worldObj.ty + offset.y,
        };
    }

    scaleButton(obj: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image |
        Phaser.GameObjects.Container, callback?: Function): void {
        const scaleX = obj.scaleX;
        const scaleY = obj.scaleY;

        this.game.tweens.add({
            targets: obj,
            scaleX: scaleX * 0.5,
            scaleY: scaleY * 1.8,
            duration: 150,
            onComplete: () => {
                this.game.tweens.add({
                    targets: obj,
                    scaleX: scaleX * 2,
                    scaleY: 0,
                    duration: 100,
                    onComplete: callback as Phaser.Types.Tweens.TweenOnCompleteCallback || (() => {}),
                });
            },
        });
    }

    popObject(obj: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image
        | Phaser.GameObjects.Container, time: number = 300): void {
        if (obj.alpha === 0) {
            obj.alpha = 1;
        }
        if (obj.scaleX === 0) {
            obj.setScale(1);
        }
        this.game.tweens.add({
            targets: obj,
            scaleX: { from: 0, to: obj.scaleX },
            scaleY: { from: 0, to: obj.scaleY },
            duration: time,
            ease: 'Back.easeOut',
        });
    }

    unpopObject(obj: Phaser.GameObjects.GameObject, time: number = 300): void {
        this.game.tweens.add({
            targets: obj,
            scale: 0,
            duration: time,
            ease: 'Back.easeIn',
        });
    }

    getClosestToPosition(objects: Phaser.GameObjects.Image[] | Phaser.GameObjects.Sprite[] |
        Phaser.GameObjects.Container[], position: { x: number; y: number }): Phaser.GameObjects.GameObject | null {
        let closestObject: Phaser.GameObjects.GameObject | null = null;
        let smallestDistance = Infinity;

        objects.forEach((object) => {
            const dx = object.x - position.x;
            const dy = object.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestObject = object;
            }
        });

        return closestObject;
    }
}
