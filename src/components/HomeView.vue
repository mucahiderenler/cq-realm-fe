<script setup lang="ts">
import { onMounted } from 'vue';
import VillageInfo from './VillageInfo.vue'
import { useVillageStore } from '../store/villageStore';
const villageStore = useVillageStore()


onMounted(async() => {
   try { 
    // get village information
    const response = await fetch('http://localhost:8080/villages/2')
    const village = await response.json()
    // update store for village
    villageStore.buildings = village.buildings
    villageStore.resources = village.resources
    villageStore.village = village.village

   } catch (error) {
    console.log(error)
   }
    
    
})


</script>

<template>
    <VillageInfo/>
</template>
