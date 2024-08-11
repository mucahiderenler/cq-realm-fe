import { Scene } from 'phaser'

interface VillageData {
  villageId: number
}

const tileWidth = 120
const tileHeight = 140

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
    this.load.image("tileset", "/village/texture.png")
    this.load.image("lumberjack", "/village/sprites/mill_crane.png")
  }

  create() {
    // call village info (buildings, resources, military, etc.)
    [this.groundLayer] = this.initMap()
    this.game.canvas.style.cursor = "pointer"
    this.initVillage()
    this.handleOnClick()
    this.createLevelText("2", 2, 1)
    // after village informations loades, create the village
  }

  initMap() {
    this.map = this.add.tilemap("village", tileWidth, tileHeight)
    this.map.addTilesetImage("tileset", "tileset")
    const groundLayer = this.map.createLayer("Ground", "tileset")
    return [groundLayer]
  }

  initVillage() {
    fetch(`http://localhost:8080/villages/${this.villageData.villageId}`).then(response => response.json()).then(data => {
      console.log(data)
      let buildings = data.Building
      buildings = buildings.filter(building => building.buildingType === 3)

      for (let lumberjack of buildings) {
        this.groundLayer?.putTileAt(57, lumberjack.tileX, lumberjack.tileY)
      }
    })
  }

  handleOnClick() {
    this.input.on("pointerdown", (pointer: any) => {
      const tile = this.groundLayer?.getTileAtWorldXY(pointer.worldX, pointer.worldY)
      if (tile) {
        console.log(tile)
      }
    })
  }

  createLevelText(level: string, tileX: number, tileY: number) {
    const tile = this.groundLayer?.getTileAt(tileX + 1, tileY + 1)
    if (tile === undefined) {
      return console.error("no tiles found", { level, tileX, tileY })
    }
    const text = this.add.text(tile.pixelX, tile.pixelY, level, {
      font: "32px Courier",
      color: "#fffffff"
    })

    text.setOrigin(0.5, 0.5)
  }
}