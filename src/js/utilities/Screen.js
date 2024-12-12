export default class Screen {
    constructor(game) {
        this.width = game.scale.gameSize.width;
        this.height = game.scale.gameSize.height;
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
    }
}