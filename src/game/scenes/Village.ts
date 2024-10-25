import { Scene } from 'phaser'
import { Building} from '../types/village'
import { EventBus } from '../EventBus'
import { useVillageStore } from '../../store/villageStore'


interface VillageData {
  villageId: number
}

const tileWidth = 120
const tileHeight = 140
let previousTileSelected: Phaser.Tilemaps.Tile | null = null
let previousTileHovered: Phaser.Tilemaps.Tile | null = null

export class Village extends Scene {
  villageData: VillageData
  groundLayer: Phaser.Tilemaps.TilemapLayer | null
  map: Phaser.Tilemaps.Tilemap
  infoText: Phaser.GameObjects.Text;
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
  }

  create() {
    this.initTooltipText()
    this.initMap()
    this.initVillage()
    EventBus.emit('current-scene-ready', this);
    EventBus.on("village-loaded", () => {
      this.initVillage()
    })
  }

  initMap() {
    this.map = this.add.tilemap("village", tileWidth, tileHeight)
    this.map.addTilesetImage("tileset", "tileset")
    this.groundLayer = this.map.createLayer("Ground", "tileset")

    this.groundLayer?.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const tile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY)
      if (tile) {
        if (previousTileSelected) {
          previousTileSelected.tint = 0xffffff
        }
        tile.tint = 0.65 * 0xffffff;
        previousTileSelected = tile
        EventBus.emit("empty-grid-selected", {x: tile.x, y: tile.y})
      }
    })

    this.groundLayer?.on("pointermove", (pointer: Phaser.Input.Pointer) => {

      const tile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY)
      if (tile && tile.properties.hasBuilding !== true) {
        if (previousTileHovered) {
          previousTileHovered.tint = 0xffffff
        } 

        tile.tint = 0.9 * 0x00ff00
        previousTileHovered = tile
      }
    })

    this.groundLayer?.setInteractive({
      useHandCursor: true
    })
  }

  initVillage() {
    const villageStore = useVillageStore()
    let buildings = villageStore.buildings as Building[]
    for (let building of buildings) {
      const tile = this.groundLayer?.getTileAt(building.tileX, building.tileY)
      if (tile === undefined) {
        console.error("Cant find the tile for building: ", building)
        continue
      }
      const pixelX = tile?.pixelX + (tileWidth / 2)
      const pixelY = tile?.pixelY + (tileHeight / 2)
      const buildingSprite = this.add.sprite(pixelX, pixelY)
      this.createLevelText(String(building.level), pixelX, pixelY)
      this.makeBuildingInteractive(building, buildingSprite)
      tile.properties.hasBuilding = true
    }
  }

  makeBuildingInteractive(building: Building, buildingSprite: Phaser.GameObjects.Sprite) {
    buildingSprite.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Circle(0, 0, tileWidth / 2),
      hitAreaCallback: Phaser.Geom.Circle.Contains
    })

    buildingSprite.depth = 2 

    buildingSprite.on("pointerover", () => {
      this.showBuildingInfo(building.name, buildingSprite)
    })

    buildingSprite.on("pointerout", () => {
      this.infoText.setVisible(false)
    })

    buildingSprite.on("pointerdown", () => {
      EventBus.emit("go-building", building)
    })
  }

  createLevelText(level: string, pixelX: number, pixelY: number) {
    this.add.text(pixelX, pixelY + 30, level, {
      font: "25px Courier",
      color: "#fffffff"
    })
  }

  showBuildingInfo(buildingName: string, buildingSprite: Phaser.GameObjects.Sprite) {
    // Update the text object and position it near the village sprite
    this.infoText.setText(buildingName);
    this.infoText.setPosition(buildingSprite.x, buildingSprite.y);
    this.infoText.setVisible(true);
  }

  initTooltipText() {
    this.infoText = this.add.text(10, 10, '', {
      fontSize: '10px',
      backgroundColor: 'rgba(1, 0, 0, 0.7)',
      padding: {
        x: 11,
        y: 6
      }
    });
    this.infoText.setVisible(false);
    this.infoText.setDepth(10)

  }

}