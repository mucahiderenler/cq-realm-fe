import { defineStore } from "pinia";
import { ref } from "vue";


export const useVillageStore = defineStore("village", () => {
    const village = ref()
    const buildings = ref()
    const resources = ref()

    return {village, buildings, resources}
})