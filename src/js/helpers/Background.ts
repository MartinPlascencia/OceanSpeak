import Screen from '../utilities/Screen';
import ColorInteractiveAsset from './ColorInteractiveAsset';
export default class Background extends Phaser.GameObjects.Container {

    private _plantsColors : string[]= ['purple', 'green', 'orange'];
    private _numberOfPlants = 2;
    private _plantsSize = 1;
    private _plants : ColorInteractiveAsset[] = [];
    constructor(scene: Phaser.Scene, screen: Screen) {
        super(scene, 0, 0);
        this.createSky(scene, screen);
        this.createBackAssets(scene, screen);
        this.createPlants(scene, screen);
        this.createGround(scene, screen);

        scene.add.existing(this);
    }

    private createBackAssets(scene: Phaser.Scene, screen: Screen) {
        const backMountain = scene.add.image(screen.width, screen.height - 200, 'game_atlas', 'back_mountain').setOrigin(1, 1);
        this.add(backMountain);

    }

    private createPlants(scene: Phaser.Scene, screen: Screen) {
        let pivotX = 100;
        const pivotY = screen.height - 245;

        while (pivotX < screen.width) {
            const plantColor = this._plantsColors[Phaser.Math.Between(0, this._plantsColors.length - 1)];
            const plant = new ColorInteractiveAsset(scene, pivotX, pivotY, 'game_atlas', plantColor + '_plant_0' + Phaser.Math.Between(0,this._numberOfPlants - 1), 
                plantColor, this._plantsSize);
            plant.setOrigin(0.5, 1);
            this.add(plant);
            this._plants.push(plant);
            pivotX += Phaser.Math.Between(100, 300);
        }
    }

    getPlants() : ColorInteractiveAsset[] {   
        return this._plants;
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

    private createGround(scene: Phaser.Scene, screen: Screen) : void {

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