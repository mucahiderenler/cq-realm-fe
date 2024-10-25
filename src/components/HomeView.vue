<script setup lang="ts">
import { onMounted } from 'vue';
import VillageInfo from './VillageInfo.vue'
import { useVillageStore } from '../store/villageStore';
import { EventBus } from '../game/EventBus';
const villageStore = useVillageStore()


onMounted(async() => {
    
    EventBus.on("empty-grid-selected", (gridPosition:{x: number, y:number}) => {
        console.log(gridPosition)
    })

   try { 
    if (villageStore.village === void 0 || villageStore.village.id !== villageStore.currentVillageSelected) {
        // get village information
        const villageId = villageStore.currentVillageSelected || 2 // it shouldn't be 2 this should come from player info later on
        const response = await fetch(`http://localhost:8080/villages/${villageId}`)
        const village = await response.json()
        // update store for village
        villageStore.buildings = village.buildings
        villageStore.resources = village.resources
        villageStore.village = village.village
        villageStore.currentVillageSelected = village.village.id

        EventBus.emit("village-loaded") // so that phaser changes its village overview as well
    }

   } catch (error) {
        console.log(error)
   }
    
    
})


</script>

<template>
    <VillageInfo/>
</template>
