
import { Scene } from 'phaser';
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
    this.load.tilemapTiledJSON("map", "/map/newMap.json")
    this.load.image("tileset", "texture.png")
  }

  create() {
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
    this.tileMap = this.createMap()
    this.initiliazeVillages()
    this.initMapMovement(this.cameras.main)
    this.input.on("pointerdown", pointer => {
      console.log(pointer.position)
    })
  }

  update(_: number, delta: number) {
    this.controls.update(delta);
  }

  createMap(): Phaser.Tilemaps.Tilemap {

    const map = this.make.tilemap({ key: "map", tileWidth: tileWidth, tileHeight: tileHeight })
    const tileSet = map.addTilesetImage("hexagon_tiles", "tileset")
    if (tileSet === null) {
      throw new Error("tileset cannot be added to map");

    }
    this.groundLayer = map.createLayer("Ground", tileSet, 0, 0)

    return map
  }
  initiliazeVillages() {
    // request villages from backend and load all
    fetch('http://localhost:8080/map').then(response => response.json()).then((data) => {
      for (let village of data.villages) {
        let villageSprite: Phaser.GameObjects.Sprite
        let tile: Phaser.Tilemaps.Tile | undefined
        if (village.point >= 3000) {
          tile = this.groundLayer?.putTileAt(86, village.x, village.y)
        } else {
          tile = this.groundLayer?.putTileAt(87, village.x, village.y)
        }
        let interactiveVillage = this.add.circle(tile?.pixelX + 60, tile?.pixelY + (70), tile?.width / 2)

        interactiveVillage.setInteractive({
          useHandCursor: true
        })
        //  villageSprite.setData('village_info', village)
        interactiveVillage.on('pointerover', () => {
          this.showVillageInfo(village, interactiveVillage);
        });

        interactiveVillage.on('pointerout', () => {
          this.hideVillageInfo();
        });

        interactiveVillage.on("pointerdown", () => {
          this.scene.start("Village", { villageId: village.id })
        })
      }
    })
  }

  showVillageInfo(village: any, interactiveVillage: any) {
    // Get the attached data
    const info = `Village Name: ${village.name}\nOwner Name: ${village.ownerName}\nPoint: ${village.point}`;

    // Update the text object and position it near the village sprite
    this.infoText.setText(info);
    this.infoText.setPosition(interactiveVillage.x, interactiveVillage.y);
    this.infoText.setVisible(true);
  }

  hideVillageInfo() {
    // Hide the text object
    this.infoText.setVisible(false);
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
}