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
        this.load.image("village", "village.png")
    }

    create() {
        this.createMap()
        this.initiliazeVillages()

    }

    createMap() {

        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 })
        const tileset1 = map.addTilesetImage("tiles1", "tiles1")
        const tileset2 = map.addTilesetImage("tiles2", "tiles2")

        const layer = map.createLayer("Tile Layer 1", [tileset1, tileset2], 0, 0)
    }
    initiliazeVillages() {
        // request villages from backend and load all
        fetch('http://localhost:8080/map').then(response => response.json()).then((data) => {
            console.log(data)
            for (let vilID in data.villages) {
                const village = data.villages[vilID]
                const villageSprite = this.add.sprite(village.x, village.y, "village")
                villageSprite.setInteractive()
                villageSprite.on("pointerdown", () => {
                    console.log("clicked on village")
                })
            }
        })
    }
}
