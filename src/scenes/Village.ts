import { Scene } from 'phaser'

interface VillageData {
  villageId: number
}

const tileWidth = 120
const tileHeight = 140

const buildingTypeToTile: Map<number, number> = {
  3: 58, // lumberjack
  2: 85, // iron ore pit
  4: 90, // farm
  1: 86, // headquarter
  5: 9,  // clay pit
  6: 45, // storage
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
    this.load.image("lumberjack", "/village/sprites/mill_crane.png")
  }

  create() {
    // call village info (buildings, resources, military, etc.)
    [this.groundLayer] = this.initMap()
    this.game.canvas.style.cursor = "pointer"
    this.initVillage()
    this.handleOnClick()
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
      for (let building of buildings) {
        const tileIndex = buildingTypeToTile[building.buildingType]
        this.groundLayer?.putTileAt(tileIndex, building.tileX, building.tileY)
        this.createLevelText(building.level, building.tileX, building.tileY)
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
    const tile = this.groundLayer?.getTileAt(tileX - 1, tileY - 1)
    if (tile === undefined) {
      return console.error("no tiles found", { level, tileX, tileY })
    }
    const text = this.add.text(tile.getCenterX() - 10, tile.getCenterY() + 70, level, {
      font: "16px Courier",
      color: "#fffffff"
    })

    // text.setOrigin(0.1, 0.1)
  }
}