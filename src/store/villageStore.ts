import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface Village {
    id: number
    name: string
    x: number
    y: number
    ownerName: string
    ownerID: number 
    point: number
    villageType: number
}

interface Building {
    id: number
    villageID: number
    name: string
    buildingType: number
    level: number
    productionRate: number
    buildTime: string
    lastUpgrade: string
    tileX: number
    tileY: number
    lastInteraction: string
    lastResource?: number
}

interface Resources {
    wood: number
    clay: number
    iron: number
}

export const useVillageStore = defineStore("village", () => {
    const village: Village = reactive({
        id: 0,
        name: "",
        x: 0,
        y: 0,
        ownerName: "",
        ownerID: 0,
        point: 0,
        villageType: 0
    }) 
    const buildings: Building[] = reactive([])
    const resources: Resources = reactive({
        wood: 0,
        clay: 0,
        iron: 0
    }) 
    const currentVillageSelected = ref()

    return {village, buildings, resources, currentVillageSelected}
})