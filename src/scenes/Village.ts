import { Scene } from 'phaser'

interface VillageData {
  villageId: number
}

export class Village extends Scene {
  villageData: VillageData
  constructor() {
    super('Village')
  }

  init(villageData: VillageData) {
    this.villageData = villageData
  }


  preload() {
    // load neccessary assets
  }

  create() {
    // call village info (buildings, resources, military, etc.)
    this.initVillage()
    // after village informations loades, create the village
  }
  initVillage() {
    console.log(this.villageData)
    fetch(`http://localhost:8080/villages/${this.villageData.villageId}`).then(response => response.json()).then(data => {
      console.log(data)
    })
  }
}