import { Scene } from 'phaser'
import { FullVillage } from '../types/village'
interface VillageData {
  villageId: number
}

const tileWidth = 120
const tileHeight = 140

const buildingTypeToTile: { [key: number]: string } = {
  3: "lumberjack",
  2: "ironOrePit",
  4: "farm",
  1: "headquarter",
  5: "clayPit",
  6: "storage",
}
export default class Village extends Scene {
  villageData: VillageData
  groundLayer: Phaser.Tilemaps.TilemapLayer | null
  map: Phaser.Tilemaps.Tilemap
  constructor() {
    super('Village')
  }

  init(villageData: VillageData) {
    this.villageData = villageData
  }


  preload() {
    this.load.setPath('assets');
    this.load.tilemapTiledJSON("village", "/village/village.json")
    this.load.image("tileset", "texture.png")
    this.load.image("lumberjack", "/village/sprites/lumberjack.png")
    this.load.image("headquarter", "/village/sprites/headquarter.png")
    this.load.image("ironOrePit", "/village/sprites/iron_ore_pit.png")
    this.load.image("farm", "/village/sprites/farm.png")
    this.load.image("clayPit", "/village/sprites/clay_pit.png")
    this.load.image("storage", "/village/sprites/storage.png")
  }

  create() {
    this.initMap()
    this.initVillage()
  }

  initMap() {
    this.map = this.add.tilemap("village", tileWidth, tileHeight)
    this.map.addTilesetImage("tileset", "tileset")
    this.groundLayer = this.map.createLayer("Ground", "tileset")
  }

  initVillage() {
    fetch(`http://localhost:8080/villages/${this.villageData.villageId}`).then(response => response.json()).then((data: FullVillage) => {
      let buildings = data.Building
      for (let building of buildings) {
        const buildingSpriteName = buildingTypeToTile[building.buildingType]
        const tile = this.groundLayer?.getTileAt(building.tileX, building.tileY)
        if (tile === undefined) {
          console.error("Cant find the tile for building: ", building)
          continue
        }
        const pixelX = tile?.pixelX + (tileWidth / 2)
        const pixelY = tile?.pixelY + (tileHeight / 2)
        const buildingSprite = this.add.sprite(pixelX, pixelY, buildingSpriteName)
        this.createLevelText(String(building.level), pixelX, pixelY)
        this.makeBuildingInteractive(buildingSprite)
      }
    })
  }

  makeBuildingInteractive(building: Phaser.GameObjects.Sprite) {
    building.setInteractive({
      useHandCursor: true
    })
    building.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      console.log(pointer)
    })
  }

  createLevelText(level: string, pixelX: number, pixelY: number) {
    this.add.text(pixelX, pixelY + 30, level, {
      font: "25px Courier",
      color: "#fffffff"
    })
  }
}