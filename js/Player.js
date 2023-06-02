export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let {scene, x, y, texture, frame} = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        // Weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.spriteWeapon)

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(
            this.x, 
            this.y, 
            12, 
            { 
                isSensor: false,
                label: 'playerCollider'
            }
        );

        var playerSensor = Bodies.circle(
            this.x, 
            this.y, 
            24, 
            { 
                isSensor: true,
                label: 'playerSensor'
            }
        );

        const compoundBody = Body.create({
            parts: [
                playerCollider,
                playerSensor
            ],
            frictionAir: 0.35,
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation(true);

        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
    }

    static preload(scene) {
        scene.load.atlas('main_char', 'assets/images/main_char.png', 'assets/images/main_char_atlas.json');
        scene.load.animation('main_char_anim', 'assets/images/main_char_anim.json');
        scene.load.spritesheet('items', 'assets/images/items.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    get velocity() {
        return this.body.velocity;
    }

    update() {
        const speed = 2;
        let playerVelocity = new Phaser.Math.Vector2();

        if(this.inputKeys.left.isDown) {
            playerVelocity.x = -1
        } else if(this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }

        if(this.inputKeys.up.isDown) {
            playerVelocity.y = -1
        } else if(this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1){
            this.anims.play('main_char_walk', true)
        } else {
            this.anims.play('main_char_idle', true)
        }

        this.spriteWeapon.setPosition(this.x, this.y);
        this.weaponRotate();
    }

    weaponRotate() {
        let pointer = this.scene.input.activePointer;

        if (pointer.isDown) {
            this.weaponRotation += 6;
        } else {
            this.weaponRotation = 0;
        }

        if (this.weaponRotation > 100) {
            this.weaponRotation = 0
        }

        if (this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        } else {
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
    }
}