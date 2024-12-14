export default class Screen {
    public width: number;
    public height: number;
    public centerX: number;
    public centerY: number;

    constructor(game: Phaser.Scene) {
        this.width = game.scale.gameSize.width;
        this.height = game.scale.gameSize.height;
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
    }
}
