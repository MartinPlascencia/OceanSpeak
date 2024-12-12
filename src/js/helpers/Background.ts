import Screen from '../utilities/Screen';
export default class Background extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, screen: Screen) {
        super(scene, 0, 0);
        this.createSky(scene, screen);
        this.createGround(scene, screen);

        scene.add.existing(this);
    }

    private createSky(scene: Phaser.Scene, screen: Screen) {
        
        const background = scene.add.image(screen.centerX, screen.centerY, '__WHITE');
        background.setDisplaySize(screen.width, screen.height * 2);

        if (background.preFX) {
            const gradient = background.preFX.addGradient();

            gradient.size = 320;
            gradient.color1 = 0xb0e9fc;
            gradient.color2 = 0xffffff;
        }

        this.add(background);
    }

    private createGround(scene: Phaser.Scene, screen: Screen) {

        const groundContainer = scene.add.container(0, screen.height);
        this.add(groundContainer);
        const numberOfSandTiles = 2;

        let tilePosition = 0;
        while (tilePosition < screen.width) {
            
            const tile = scene.add.image(tilePosition, 0, 'game_atlas', 'sand_0' + Phaser.Math.Between(0, numberOfSandTiles)).setOrigin(0, 1);
            groundContainer.add(tile);

            const topTile = scene.add.image(tile.x, tile.y - tile.displayHeight, 'game_atlas', 'sand_tile_02').setOrigin(0, 1);
            groundContainer.add(topTile);
            tilePosition += tile.displayWidth;
        }
        
    }



}