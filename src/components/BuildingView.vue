<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useVillageStore } from '../store/villageStore';

const route = useRoute()
const villageStore = useVillageStore()

interface BuildingDetails {
  buildingAdvantage: number
  buildingNextAdvantage: number
  upgradeTime: number
  upgradeCosts: { wood:number, clay: number, iron: number}
  currentLevel: number
  neededPopulation: number
}

const buildingDetails: BuildingDetails = reactive({
  buildingAdvantage: 0,
  buildingNextAdvantage: 0,
  upgradeTime: 0,
  upgradeCosts: {wood: 0, clay: 0, iron: 0},
  currentLevel: 0,
  neededPopulation: 0
})

const buildingId = route.params.buildingId
const building = villageStore.buildings.find(b => b.buildingID === +buildingId)
const buildingImage = `/assets/village/sprites/${building?.name.toLowerCase().replace(" ", "_")}.png`;
const currentVillageId = villageStore.currentVillageSelected


onMounted(async() => {
  try {  
    const response = await fetch(`http://localhost:8080/villages/${currentVillageId}/building/${buildingId}`)
    const respJSON: BuildingDetails = await response.json()
    Object.assign(buildingDetails, respJSON)
  } catch (error) {
    console.error("failed to load building details: ", error)
  }
})


const enoughWoodForUpgrade = computed<boolean>(() => {
  return villageStore.resources.wood >= buildingDetails.upgradeCosts.wood
}) 
const enoughClayForUpgrade = computed<boolean>(() => {
  return villageStore.resources.clay >= buildingDetails.upgradeCosts.clay
}) 
const enoughIronForUpgrade = computed<boolean>(() => {
  return villageStore.resources.iron >= buildingDetails.upgradeCosts.iron
}) 

const upgradeBuilding = async() => {
  if (enoughWoodForUpgrade.value && enoughClayForUpgrade.value && enoughIronForUpgrade.value) {
    try {
        await fetch(`http://localhost:8080/building/${buildingId}/upgrade`, {
            method: "POST",
            body: JSON.stringify({
                villageId: currentVillageId.toString()
            })
        })
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
    <div class="buildings-page">
      <header class="building-header">
        <h1>{{ building?.name }}</h1>
      </header>
  
      <div class="building-image-container">
        <img :src="buildingImage" :alt="building?.name" class="building-image" />
      </div>
  
      <section class="building-details">
        <h2>Building Details</h2>
        <p>
          buildings is the center of the village. Upgrade this building to decrease building time of construction.
        </p>
  
        <ul>
          <li><strong>Level:</strong> {{buildingDetails.currentLevel}} </li>
          <li><strong>Current Benefit</strong> Building time decrease {{buildingDetails.buildingAdvantage}}% </li>
          <li><strong>Upgrade Time:</strong> {{ buildingDetails.upgradeTime }} seconds</li>
          <li><strong>Next Level Benefits:</strong> Building time decrease {{buildingDetails.buildingNextAdvantage}}% </li>
          <li><strong>Upgrade Cost:</strong> Wood: {{buildingDetails.upgradeCosts?.wood}} Clay: {{ buildingDetails.upgradeCosts?.clay }} Iron: {{ buildingDetails.upgradeCosts?.iron }} </li>
        </ul>
  
        <div class="building-actions">
          <button @click="upgradeBuilding">Upgrade</button>
        </div>
      </section>
    </div>
  </template>


<style scoped>
.buildings-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.building-header {
  margin-top: 20px;
  font-size: 2em;
}

.building-image-container {
  margin: 20px 0;
}

.building-image {
  max-width: 100%;
  height: auto;
}

.building-details {
  background-color: #f4f4f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.building-details h2 {
  margin-bottom: 10px;
}

.building-details ul {
  list-style-type: none;
  padding: 0;
}

.building-details ul li {
  margin: 10px 0;
}

.building-actions {
  margin-top: 20px;
}

.building-actions button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.building-actions button:hover {
  background-color: #0056b3;
}
</style>