class Checkpoint extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add object to existing scene, displayList, updateList
        this.manholeStart = false;
        this.rowStartMH = 1;
    }

    update() {
        if (this.manholeStart == true) {
            this.x += game.settings.globalSpeed;
        }
    }

    spawn() {
        this.rowStartMH = Phaser.Math.Between(0, 2);
        if (this.rowStartMH == 0) {
            this.y = 360 + 95 - 144;
        } else if (this.rowStartMH == 1) {
            this.y = 360 + 95;
        } else if (this.rowStartMH == 2) {
            this.y = 360 + 95 + 144;
        }
    }
}