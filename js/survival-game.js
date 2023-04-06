var config = {
    width: 512,
    height: 512,
    backgroundColor: '#333333',
    type: Phaser.AUTO,
    parent: 'survival-game',
    scene: [],
    scale: {
        zoom: 2,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            grafity: {
                y: 0,
            }
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: 'matterCollision',
                mapping: 'matterCollision',
            }
        ]
    },
}

var game = new Phaser.Game(config);