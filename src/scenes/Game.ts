
import { Scene } from 'phaser';
import { GameMap, Village } from '../types/map';
const tileWidth = 120
const tileHeight = 140

export class Game extends Scene {
  infoText: Phaser.GameObjects.Text;
  controls: Phaser.Cameras.Controls.SmoothedKeyControl;
  tileMap: Phaser.Tilemaps.Tilemap
  groundLayer: Phaser.Tilemaps.TilemapLayer | null
  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
    this.load.tilemapTiledJSON("map", "/map/map.json")
    this.load.image("tileset", "texture.png")
    this.load.image("barbar", "/map/sprites/barbar.png")
    this.load.image("village1", "/map/sprites/village1.png")
    this.load.image("village2", "/map/sprites/village2.png")
  }

  create() {
    this.initTooltipText()
    // sets this.groundLayer and this.tileMap
    this.createMap()
    this.initiliazeVillages()
    this.initMapMovement(this.cameras.main)
  }

  update(_: number, delta: number) {
    this.controls.update(delta);
  }

  createMap() {
    const map = this.make.tilemap({ key: "map", tileWidth: tileWidth, tileHeight: tileHeight })
    const tileSet = map.addTilesetImage("hexagon_tiles", "tileset")
    if (tileSet === null) {
      throw new Error("tileset cannot be added to map");

    }
    this.groundLayer = map.createLayer("Ground", tileSet, 0, 0)
    this.tileMap = map
  }
  initiliazeVillages() {
    fetch('http://localhost:8080/map').then(response => response.json()).then((data: GameMap) => {
      for (let village of data.villages) {
        let villageSprite: Phaser.GameObjects.Sprite
        const tile = this.groundLayer?.getTileAt(village.x, village.y)
        if (tile === undefined) {
          console.error("Tile not found for village:", village)
          continue
        }
        const pixelX = tile?.pixelX + (tileWidth / 2)
        const pixelY = tile?.pixelY + (tileHeight / 2)
        if (village.ownerID === -1) {
          villageSprite = this.add.sprite(pixelX, pixelY, "barbar")
        }
        else if (village.point >= 3000) {
          villageSprite = this.add.sprite(pixelX, pixelY, "village2")
        } else {
          villageSprite = this.add.sprite(pixelX, pixelY, "village1")
        }
        this.makeVillageInteractive(village, villageSprite)
      }
    })
  }
  makeVillageInteractive(village: Village, villageSprite: Phaser.GameObjects.Sprite) {
    villageSprite.setInteractive({
      useHandCursor: true
    })
    villageSprite.on('pointerover', () => {
      this.showVillageInfo(village, villageSprite);
    });

    villageSprite.on('pointerout', () => {
      this.infoText.setVisible(false);
    });

    villageSprite.on("pointerdown", () => {
      this.scene.start("Village", { villageId: village.id })
    })

  }
  showVillageInfo(village: Village, villageSprite: Phaser.GameObjects.Sprite) {
    // Get the attached data
    const info = `Village Name: ${village.name}\nOwner Name: ${village.ownerName}\nPoint: ${village.point}`;

    // Update the text object and position it near the village sprite
    this.infoText.setText(info);
    this.infoText.setPosition(villageSprite.x, villageSprite.y);
    this.infoText.setVisible(true);
  }


  initMapMovement(camera: Phaser.Cameras.Scene2D.Camera) {
    this.input.on("pointermove", function (p: any) {
      if (!p.isDown) return;
      camera.scrollX -= (p.x - p.prevPosition.x) / camera.zoom;
      camera.scrollY -= (p.y - p.prevPosition.y) / camera.zoom;
    });


    if (this.input.keyboard === null) {
      console.error("Keyboard keys cannot be initialized")
      return
    }
    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.02,
      drag: 0.0005,
      maxSpeed: 0.7
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    // camera.setBounds(0, 0, 2040, 1920)
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