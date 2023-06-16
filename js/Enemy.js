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
    }

    update() {
        // console.log('enemy update');
    }
}