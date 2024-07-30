import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('assets');
        this.load.tilemapTiledJSON("map", 'map1.json')
        this.load.image("tiles1", "TexturedGrass.png")
        this.load.image("tiles2", "Winter.png")
    }

    create() {

        // this.add.image(512, 384, 'background');
        // this.add.image(512, 350, 'logo').setDepth(100);
        // this.add.text(512, 490, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);


        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 })
        const tileset1 = map.addTilesetImage("tiles1", "tiles1")
        const tileset2 = map.addTilesetImage("tiles2", "tiles2")

        const layer = map.createLayer("Tile Layer 1", [tileset1, tileset2], 0, 0)
    }
}
