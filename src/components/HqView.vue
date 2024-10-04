<script setup lang="ts">
const hqImage = "/assets/texture.png";

const upgradeBuilding = () => {
  alert("Upgrading the headquarters...");
};

const manageResources = () => {
  alert("Managing resources...");
};
</script>


<template>
    <div class="headquarters-page">
      <!-- Header -->
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
          Headquarters is the center of the village. From here, you can manage upgrades, monitor resources, and oversee the growth of your empire.
        </p>
  
        <!-- Example details (can be dynamic) -->
        <ul>
          <li><strong>Level:</strong> 5</li>
          <li><strong>Upgrade Time:</strong> 30 minutes</li>
          <li><strong>Next Level Benefits:</strong> Increased resource management capacity</li>
        </ul>
  
        <!-- Buttons to upgrade or manage -->
        <div class="hq-actions">
          <button @click="upgradeBuilding">Upgrade</button>
          <button @click="manageResources">Manage Resources</button>
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