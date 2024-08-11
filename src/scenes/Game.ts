import { Scene } from 'phaser';

export class Game extends Scene {
    infoText: Phaser.GameObjects.Text;
    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    tileMap: Phaser.Tilemaps.Tilemap
    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('assets');
        this.load.tilemapTiledJSON("map", "/map/map.json")
        this.load.image("water", "/map/water.png")
        this.load.image("ground/villages", "map/tileset.png")
        this.load.image("mountains", "map/mountains.png")
        this.load.image("villageBasic", "map/village_basic.png")
        this.load.image("villageAdvanced", "map/village_advanced.png")
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
    }

    update(_: number, delta: number) {
        this.controls.update(delta);
    }

    createMap(): Phaser.Tilemaps.Tilemap {

        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 })
        const waterTileSet = map.addTilesetImage("water")
        const mainTileSet = map.addTilesetImage("ground/villages")
        const mountainTileSet = map.addTilesetImage("mountains")
        if (waterTileSet === null || mainTileSet === null || mountainTileSet === null) {
            throw console.error("tileset cannot be added")
        }
        map.createLayer("Water", waterTileSet, 0, 0)
        map.createLayer("Ground", mainTileSet, 0, 0)
        map.createLayer("Tree/Mountain", [mainTileSet, mountainTileSet], 0, 0)
        map.createLayer("Villages", mainTileSet, 0, 0)

        return map
    }
    initiliazeVillages() {
        // request villages from backend and load all
        fetch('http://localhost:8080/map').then(response => response.json()).then((data) => {
            for (let village of data.villages) {
                let villageSprite: Phaser.GameObjects.Sprite
                if (village.point >= 3000) {
                    villageSprite = this.add.sprite(village.x * 16, village.y * 16, "villageAdvanced")
                } else {
                    villageSprite = this.add.sprite(village.x * 16, village.y * 16, "villageBasic")
                }
                villageSprite.setInteractive({
                    useHandCursor: true
                })
                // villageSprite.setData('village_info', village)
                villageSprite.on('pointerover', () => {
                    this.showVillageInfo(village);
                });

                villageSprite.on('pointerout', () => {
                    this.hideVillageInfo();
                });

                villageSprite.on("pointerdown", () => {
                    this.scene.start("Village", { villageId: village.id })
                })
            }
        })
    }

    showVillageInfo(village: any) {
        // Get the attached data
        const info = `Village Name: ${village.name}\nOwner Name: ${village.ownerName}\nPoint: ${village.point}`;

        // Update the text object and position it near the village sprite
        this.infoText.setText(info);
        this.infoText.setPosition((village.x * 16) + 30, (village.y * 16) - 30);
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
        camera.setBounds(0, 0, 2040, 1920)
    }
}