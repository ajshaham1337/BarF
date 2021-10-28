class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Load assets
        this.load.image('runner', './assets/runner.png');
        this.load.image('beer', './assets/beer.png');
        this.load.image('obstacle', './assets/roadbarrier.png');
        this.load.image('manhole', './assets/manhole.png');
        this.load.image('botbg', './assets/street.png');
        this.load.image('topbg', './assets/finalsw.png');
        this.load.spritesheet('runanim', './assets/run_final_empty.png', {frameWidth: 74, frameHeight: 66, startFrame: 0, endFrame: 8});
        this.load.spritesheet('vomitanim', './assets/vomit_empty.png', { frameWidth: 45, frameHeight: 59, startFrame: 0, endFrame: 6});
        this.load.audio('cheersfx', './assets/cheers.mp3');
        this.load.audio('bgmusic', './assets/bglofi.mp3');
        this.load.audio('scoresfx', './assets/cashin.mp3');
    }

    create() {
        // Place tile sprite
        this.wpTop = this.add.tileSprite(0, 0, 632, 70, 'topbg').setScale(4, 4).setOrigin(0, 0);
        this.wpBot = this.add.tileSprite(0, 283, 316, 108, 'botbg').setScale(4.1, 4).setOrigin(0, 0);

        // Define keyboard keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Play music
        this.music = this.sound.add('bgmusic');
        this.music.play({ volume: 0.1, loop: -1 });

        // Player animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('runanim', {start: 0, end: 7, first: 0}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({ //use from same sprite at a later point.
            key: 'vomit',
            frames: this.anims.generateFrameNumbers('vomitanim', { start: 0, end: 5, first: 0 }),
            frameRate: 12,
            repeat: -1,
        })

        // Add checkpoint
        this.manhole = new Checkpoint(this, -200, 360 + 95 - 144, 'manhole').setScale(2.1, 2.1).setSize(100, 100).setOrigin(0, 0);
        // Add beer
        this.beer = new Beer(this, -200, 360 + 60 - 144, 'beer').setScale(2, 2).setSize(72,100).setOrigin(0);
        // Add barriers
        this.barrier0 = new Obstacle(this, -640, 288 + 25, 'obstacle').setScale(4, 4).setOrigin(0.5);
        this.barrier1 = new Obstacle(this, 0, 288 + 25 + 144, 'obstacle').setScale(4, 4).setOrigin(0.5);
        this.barrier2 = new Obstacle(this, -320, 288 + 25 + 2 * 144, 'obstacle').setScale(4, 4).setOrigin(0.5);
        this.barrier3 = new Obstacle(this, -960, 288 + 25 + 144, 'obstacle').setScale(4, 4).setOrigin(0.5);
        // Add player
        this.player = new Player(this, 1000, 3 * 144 - 20, 'runanim').setScale(3, 3).setSize(160, 160).setOrigin(0, 0.5);
        this.player.anims.play('run')

        // Conditions
        this.gameOver = false;
        this.positionChecker = true;
        this.isManholeTimer = false;
        this.isBeerTimer = false;
        this.isBarrierTimer == false
        this.isPointTimer = false;
        this.isVomiting = false;
        this.isMoving = true;
        this.moveAnimOn = true;
        this.soundBool = false;
        // Score 
        this.weight = 0;
        this.points = 0;

        // Text format
        this.playConfig = {
            fontFamily: 'Courier New',
            fontSize: '28px',
            backgroundColor: '#FF00FF',
            color: '#000',
            align: 'right',
            padding: {
                top: 2,
                bottom: 2,
            },
            fixedWidth: 0
        }
        this.centerX = game.config.width / 2;
        this.centerY = game.config.height / 2;
        this.textSpacer = 64;

        // Displays
        this.highScore = this.add.text(5, 5, "High Score: " + game.settings.highScore, this.playConfig);
        this.score = this.add.text(5, 35, "Score: 0", this.playConfig);
        this.beerCount = this.add.text(5, 65, "Beers: 0", this.playConfig);
        // Borders
        this.add.rectangle(0, 0, 1280, 5, 0x000000).setOrigin(0, 0); // left
        this.add.rectangle(0, 715, 1280, 5, 0x000000).setOrigin(0, 0); // bottom
        this.add.rectangle(0, 0, 5, 720, 0x000000).setOrigin(0, 0); // top
        this.add.rectangle(1275, 0, 5, 720, 0x000000).setOrigin(0, 0); // right    
    }

    update() {
        // Tile scrolling
        this.wpTop.tilePositionX -= game.settings.globalSpeed / 4;
        this.wpBot.tilePositionX -= game.settings.globalSpeed / 4;

        // Killed by edge
        if (this.player.x >= game.settings.killZone) {
            this.player.alpha = 0;
            this.gameOver = true;
        }

        // Game over and scene swap
        if (this.gameOver == true) {
            this.add.text(this.centerX, this.centerY, 'Press (M) To Return To The Main Menu!', this.playConfig).setOrigin(0.5);
            this.add.text(this.centerX, this.centerY - this.textSpacer, 'Press (R) To Restart!', this.playConfig).setOrigin(0.5);
            if (keyR.isDown) {
                this.scene.start("playScene");
            }
            if (keyM.isDown) {
                this.scene.start("menuScene");
            }
            this.music.stop();
            game.settings.globalSpeed = 6;
            this.weight = 0;
            game.settings.startPositionBuffer = 0;
        }

        // Manhole spawner
        if (this.isManholeTimer == false) {
            this.isManholeTimer = true;
            // 15-second timer
            this.manholeTimer = this.time.delayedCall(10000, () => {
                this.isManholeTimer = false;
                this.manhole.x = -50;
                this.manhole.manholeStart = true;
                this.manhole.spawn();
            }, null, this);
        }
        // Beer spawner
        if (this.isBeerTimer == false) {
            this.isBeerTimer = true;
            // 5-second timer
            this.beerTimer = this.time.delayedCall(5000, () => {
                this.isBeerTimer = false;
                this.beer.x = -50;
                this.beer.alpha = 1;
                this.beer.spawn();
            }, null, this);
        }

        // Check player collisions
        if (this.checkCollision(this.player, this.barrier0)) {
            this.playerHit(this.player, this.barrier0);
        }
        if (this.checkCollision(this.player, this.barrier1)) {
            this.playerHit(this.player, this.barrier1);
        }
        if (this.checkCollision(this.player, this.barrier2)) {
            this.playerHit(this.player, this.barrier2);
        }
        if (this.checkCollision(this.player, this.barrier3)) {
            this.playerHit(this.player, this.barrier3);
        }
        if (this.checkCollision(this.player, this.beer)) {
            this.playerDrink(this.beer);
        }
        if (this.checkCollision(this.player, this.manhole) && keyF.isDown) {
            this.playerVomit(this.player);
            this.isVomiting = true;
        } else {
            this.isVomiting = false;
        } 
        // Stacking prevention for objects - beer
        if (this.checkCollision(this.beer, this.barrier0)) {
            this.beer.x -= 160;
        }
        if (this.checkCollision(this.beer, this.barrier1)) {
            this.beer.x -= 160;
        }
        if (this.checkCollision(this.beer, this.barrier2)) {
            this.beer.x -= 160;
        }
        if (this.checkCollision(this.beer, this.barrier3)) {
            this.beer.x -= 160;
        }
        // Stacking prevention for objects - manhole
        if (this.checkCollision(this.manhole, this.barrier0)) {
            this.manhole.x -= 160;
        }
        if (this.checkCollision(this.manhole, this.barrier1)) {
            this.manhole.x -= 160;
        }
        if (this.checkCollision(this.manhole, this.barrier2)) {
            this.manhole.x -= 160;
        }
        if (this.checkCollision(this.manhole, this.barrier3)) {
            this.manhole.x -= 160;
        }

        // Update objects
        if (this.gameOver) {
            this.player.x = 100000000;
        }
        this.player.update();
        this.beer.update();
        this.manhole.update();
        this.barrier0.update();
        this.barrier1.update();
        this.barrier2.update();
        this.barrier3.update();

        // Increase high score and repaint (if applicable)
        if (this.points > game.settings.highScore) {
            game.settings.highScore = this.points;
            this.highScore.text = "High Score: " + game.settings.highScore;
        }

        // Player x-movement
            // Prevent player from going past start position - probably unneeded code tbh.
        if (this.player.x <= game.config.width / 2 - game.settings.startPositionBuffer && this.isVomiting == false) {
            this.positionChecker = true;
            this.isMoving = true;
            if (this.isMoving == true && this.moveAnimOn == false) {
                this.moveAnimOn = true;
                this.player.anims.play('run')
                this.soundBool = false;
            }
            // Check to see if player has been displaced from start position
        } else if (this.player.x > game.config.width / 2 - game.settings.startPositionBuffer && this.isVomiting == false) {
            this.positionChecker = false;
            this.isMoving = true;
            if (this.isMoving == true && this.moveAnimOn == false) {
                this.moveAnimOn = true;
                this.player.anims.play('run')
                this.soundBool = false;
            }
        }
            // Player catch up to start position if not being pushed or vomiting.
        if (this.positionChecker == false && this.isVomiting == false &&
            !this.checkCollision(this.player, this.barrier0) &&
            !this.checkCollision(this.player, this.barrier1) &&
            !this.checkCollision(this.player, this.barrier2) &&
            !this.checkCollision(this.player, this.barrier3)) {
            this.player.x -= 1;
            this.isMoving = true;
            this.soundBool = false;
        }
            // Stop run animation when player is vomiting
        if (this.isVomiting == true) {
            this.player.x += game.settings.globalSpeed;
            this.isMoving = false;
            if (this.isMoving == false && this.moveAnimOn == true) {
                this.moveAnimOn = false;
                this.player.anims.stop('run')
                if (this.weight >= 1) {
                    this.player.anims.play('vomit');
                }
            }
        }
    }

    // Axis-Aligned Bounding Boxes checking
    checkCollision(player, object) {
        if (player.x < object.x + object.width &&
            player.x + player.width > object.x &&
            player.y < object.y + object.height &&
            player.height + player.y > object.y) {
            return true;
        } else {
            return false;
        }
    }

    // Player-car reaction
    playerHit(player) {
        player.x += game.settings.globalSpeed;
        this.isMoving = false;
        // Stop run animation
        if (this.isMoving == false && this.moveAnimOn == true) {
            this.moveAnimOn = false;
            this.player.anims.stop('run')
        }
    }

    // Player-drink reaction
    playerDrink(drink) {
        this.sound.play('cheersfx', { volume: 0.2 });
        this.weight++;
        this.beerCount.text = "Beers: " + this.weight;
        drink.alpha = 0;
        drink.x += 300;
        game.settings.globalSpeed += 1;
        if (game.settings.startPositionBuffer < 400) {
            game.settings.startPositionBuffer += 50;
        }
    }

    // Player scoring
    playerVomit(player) { //take out player maybe
        if (this.weight > 0) {
            // Score manipulation
            if (this.isPointTimer == false) {
                this.isPointTimer = true;
                // Timer to turn unload beers 1 by 1
                this.pointTimer = this.time.delayedCall(250, () => {
                    this.soundBool = false;
                    this.isPointTimer = false;
                    this.weight--;
                    this.beerCount.text = "Beers: " + this.weight;
                    if (game.settings.startPositionBuffer >= 50) {
                        game.settings.startPositionBuffer -= 50;
                    }
                    this.points += 100;
                    game.settings.globalSpeed -= 1;
                    this.score.text = "Score: " + this.points;
                }, null, this);
            }
            if (this.soundBool == false) {
                this.sound.play('scoresfx', { volume: 0.2 });
                this.soundBool = true;
            }
        }
    }
}