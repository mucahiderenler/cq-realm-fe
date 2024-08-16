<script setup lang="ts">
import Navigation from './components/Navigation.vue';
import PhaserGame from './game/PhaserGame.vue';


</script>

<template>
    <Navigation/>
    <main><RouterView/></main>
    <PhaserGame/>
</template>
