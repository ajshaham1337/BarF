class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.positionTracker = 0;
    }

    update() {
        // player motion ↑↓
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.positionTracker != 1) {
            this.y -= 144;
            this.positionTracker++;
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && this.positionTracker != -1) {
            this.y += 144;
            this.positionTracker--;
        }

        /*
        // test movement only ←→
        if (Phaser.Input.Keyboard.JustDown(keyLEFT) && this.x > 0) {
            this.x -= 50;
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.x += 50;
        }
        */
    }
}