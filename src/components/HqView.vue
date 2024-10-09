<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useVillageStore } from '../store/villageStore';

const route = useRoute()
const villageStore = useVillageStore()
const hqImage = "/assets/texture.png";

interface BuildingDetails {
  buildingSpeed: number
  upgradeTime: number
  upgradeCosts: { wood:number, clay: number, iron: number}
  currentLevel: number
  neededPopulation: number
}

const hqDetails: BuildingDetails = reactive({
  buildingSpeed: 0,
  upgradeTime: 0,
  upgradeCosts: {wood: 0, clay: 0, iron: 0},
  currentLevel: 0,
  neededPopulation: 0
})

const buildingId = route.params.buildingId
const currentVillageId = villageStore.currentVillageSelected

const enoughWoodForUpgrade = computed<boolean>(() => {
  return villageStore.resources.wood >= hqDetails.upgradeCosts.wood
}) 
const enoughClayForUpgrade = computed<boolean>(() => {
  return villageStore.resources.clay >= hqDetails.upgradeCosts.clay
}) 
const enoughIronForUpgrade = computed<boolean>(() => {
  return villageStore.resources.iron >= hqDetails.upgradeCosts.iron
}) 

onMounted(async() => {
  try {  
    const response = await fetch(`http://localhost:8080/villages/${currentVillageId}/building/${buildingId}`)
    const respJSON: BuildingDetails = await response.json()
    Object.assign(hqDetails, respJSON)
  } catch (error) {
    console.error("failed to load building details: ", error)
  }
})


const upgradeBuilding = async() => {
  if (enoughWoodForUpgrade.value && enoughClayForUpgrade.value && enoughIronForUpgrade.value) {
    try {
        const response = await fetch(`http://localhost:8080/building/${buildingId}/upgrade`, {
            method: "POST",
            body: JSON.stringify({
                villageId: currentVillageId.toString()
            })
        })
        const respJSON = await response.json()
        console.log(respJSON)
        alert("Upgrade has been started")
    } catch (error) {
        console.error("failed to start upgrading building: ", error)    
    }
  } else {
    alert("Not enough resources");
  }
};

</script>


<template>
    <div class="headquarters-page">
      <header class="hq-header">
        <h1>Headquarters</h1>
      </header>
  
      <!-- Image of the headquarters -->
      <div class="hq-image-container">
        <img :src="hqImage" alt="Headquarters" class="hq-image" />
      </div>
  
      <!-- Headquarters details -->
      <section class="hq-details">
        <h2>Building Details</h2>
        <p>
          Headquarters is the center of the village. Upgrade this building to decrease building time of construction.
        </p>
  
        <ul>
          <li><strong>Level:</strong> {{hqDetails.currentLevel}} </li>
          <li><strong>Upgrade Time:</strong> {{ hqDetails.upgradeTime }} seconds</li>
          <li><strong>Next Level Benefits:</strong> Building time decrease {{hqDetails.buildingSpeed}}% </li>
          <li><strong>Upgrade Cost:</strong> Wood: {{hqDetails.upgradeCosts?.wood}} Clay: {{ hqDetails.upgradeCosts?.clay }} Iron: {{ hqDetails.upgradeCosts?.iron }} </li>
        </ul>
  
        <div class="hq-actions">
          <button @click="upgradeBuilding">Upgrade</button>
        </div>
      </section>
    </div>
  </template>


<style scoped>
.headquarters-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hq-header {
  margin-top: 20px;
  font-size: 2em;
}

.hq-image-container {
  margin: 20px 0;
}

.hq-image {
  max-width: 100%;
  height: auto;
}

.hq-details {
  background-color: #f4f4f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hq-details h2 {
  margin-bottom: 10px;
}

.hq-details ul {
  list-style-type: none;
  padding: 0;
}

.hq-details ul li {
  margin: 10px 0;
}

.hq-actions {
  margin-top: 20px;
}

.hq-actions button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.hq-actions button:hover {
  background-color: #0056b3;
}
</style>