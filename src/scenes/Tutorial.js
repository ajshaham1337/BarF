class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    // load tutorial assets
    preload() {

    }

    create() {
        // text display
        let tutorialConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show tutorial text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        this.add.text(centerX, centerY - 200, 'Tutorial', tutorialConfig).setScale(1.5, 1.5).setOrigin(0.5);
        this.add.text(centerX, centerY - 105, 'Objective:', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 70, 'Collect beers while dodging the barriers', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 35, 'Game speed correlates to total amount of unspent beers', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Going off of the screen will result in game over', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 70, 'Controls: ', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 105, '↑ to move up | ↓ to move down', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 140, 'Press F while on a manhole to turn in a beer', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 175, 'Holding F will turn in multiple beers', tutorialConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 250, 'Press F To Play', tutorialConfig).setOrigin(0.5);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start("playScene");
        }
    }
}
