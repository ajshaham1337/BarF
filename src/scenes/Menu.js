class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // load menu assets
    preload() {
        this.load.spritesheet('gamelogo', './assets/gamelogo_empty.png', { frameWidth: 173, frameHeight: 66, startFrame: 0, endFrame: 1 });
        this.load.image('botbg', './assets/street.png');
        this.load.image('topbg', './assets/finalsw.png');
    }

    create() {
        // Place tile sprite
        this.wpTop = this.add.tileSprite(0, 0, 632, 70, 'topbg').setScale(4, 4).setOrigin(0, 0);
        this.wpBot = this.add.tileSprite(0, 283, 316, 108, 'botbg').setScale(4.1, 4).setOrigin(0, 0);
        // Borders
        this.add.rectangle(0, 0, 1280, 5, 0x000000).setOrigin(0, 0); // left
        this.add.rectangle(0, 715, 1280, 5, 0x000000).setOrigin(0, 0); // bottom
        this.add.rectangle(0, 0, 5, 720, 0x000000).setOrigin(0, 0); // top
        this.add.rectangle(1275, 0, 5, 720, 0x000000).setOrigin(0, 0); // right  

        this.anims.create({
            key: 'gamelogo',
            frames: this.anims.generateFrameNumbers('gamelogo', { start: 0, end: 1, first: 0 }),
            frameRate: 5,
            repeat: -1,
        });
        this.logo = new Player(this, game.config.width / 2, game.config.height / 2 - 100, 'gamelogo').setScale(4, 4).setOrigin(0.5); // bootleg way to do it...
        this.logo.anims.play('gamelogo')

        // text display
        let menuConfig = {
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

        // show menu text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        this.add.text(centerX, centerY + 110, 'Press F To Play', menuConfig).setScale(2).setOrigin(0.5);
        this.add.text(centerX, centerY + 160, 'Press T For Tutorial', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 340, 'By: Alexander Shaham, Terence So, Brandon Leung', menuConfig).setScale(0.5).setOrigin(0.5);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    }

    update() {
        // Tile scrolling
        this.wpTop.tilePositionX -= game.settings.globalSpeed / 4;
        this.wpBot.tilePositionX -= game.settings.globalSpeed / 4;

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            //this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyT)) {
            //this.sound.play('sfx_select');
            this.scene.start("tutorialScene");
        }
    }
}
