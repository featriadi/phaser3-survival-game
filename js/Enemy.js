import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {
    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies/enemies.png', 'assets/images/enemies/enemies_atlas.json');
        scene.load.animation('enemies_anim', 'assets/images/enemies/enemies_anim.json');
        scene.load.audio('bear', 'assets/audio/bear.wav');
        scene.load.audio('ent', 'assets/audio/ent.wav');
        scene.load.audio('wolf', 'assets/audio/wolf.wav');
    }

    constructor(data) {
        let {scene, enemy} = data;
        let drops = JSON.parse(enemy.properties.find(p => p.name == 'drops').value);
        let health = enemy.properties.find(p => p.name == 'health').value;
        
        super({
            name: enemy.name,
            scene,
            x: enemy.x,
            y: enemy.y,
            health: health,
            drops,
            texture: 'enemies',
            frame: `${enemy.name}_idle_1`,   
        });

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var enemyCollider = Bodies.circle(
            this.x, 
            this.y, 
            12, 
            { 
                isSensor: false,
                label: 'enemyCollider'
            }
        );

        var enemySensor = Bodies.circle(
            this.x, 
            this.y, 
            80, 
            { 
                isSensor: true,
                label: 'enemySensor'
            }
        );

        const compoundBody = Body.create({
            parts: [
                enemyCollider,
                enemySensor
            ],
            frictionAir: 0.35,
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation(true);
        this.scene.matterCollision.addOnCollideStart({
            objectA: [enemySensor],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.name == 'player') this.attacking = other.gameObjectB
            },
            context: this.scene,
        })
    }

    update() {
        if(this.dead) return;

        if(this.attacking) {
            let direction = this.attacking.position.subtract(this.position);
            if(direction.length() > 24) {
                let v = direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
                if(this.attackTimer){
                    clearInterval(this.attackTimer);
                    this.attackTimer = null;
                }
            } else {
                if(this.attackTimer == null) {
                    this.attackTimer = setInterval(this.attack, 500, this.attacking);
                } 
            }
        }
        
        this.setFlipX(this.velocity.x < 0);

        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1){
            this.anims.play(`${this.name}_walk`, true)
        } else {
            this.anims.play(`${this.name}_idle`, true)
        }
    }

    attack = (target) => {
        if(target.dead || this.dead) {
            clearInterval(this.attackTimer);
            return;
        }
        target.hit();
    }
}