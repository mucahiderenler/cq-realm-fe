import { Scene } from 'phaser'
import { FullVillage } from '../types/village'
import { EventBus } from '../EventBus'
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
    this.load.image("lumberjack", "/village/sprites/lumberjack.png")
    this.load.image("headquarter", "/village/sprites/headquarter.png")
    this.load.image("ironOrePit", "/village/sprites/iron_ore_pit.png")
    this.load.image("farm", "/village/sprites/farm.png")
    this.load.image("clayPit", "/village/sprites/clay_pit.png")
    this.load.image("storage", "/village/sprites/storage.png")
  }

  create() {
    this.initTooltipText()
    this.initMap()
    this.initVillage()
    EventBus.emit('current-scene-ready', this);
  }

  initMap() {
    this.map = this.add.tilemap("village", tileWidth, tileHeight)
    this.map.addTilesetImage("tileset", "tileset")
    this.groundLayer = this.map.createLayer("Ground", "tileset")
  }

  initVillage() {
    // 2 should be changedto villageData.villageId in future
    fetch(`http://localhost:8080/villages/${2}`).then(response => response.json()).then((data: FullVillage) => {
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
        this.makeBuildingInteractive(building.name, buildingSprite)
      }
    })
  }

  makeBuildingInteractive(buildingName:string, buildingSprite: Phaser.GameObjects.Sprite) {
    buildingSprite.setInteractive({
      useHandCursor: true
    })
    buildingSprite.on("pointerover", (pointer: Phaser.Input.Pointer) => {
      this.showBuildingInfo(buildingName, buildingSprite)
    })

    buildingSprite.on("pointerout", (pointer: Phaser.Input.Pointer) => {
      this.infoText.setVisible(false)
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