<script setup lang="ts">
import { onMounted, onUnmounted  } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import { usePhaserStore } from '../store/phaserStore';
import { useRouter } from 'vue-router';
const phaserStore = usePhaserStore()
import { useVillageStore } from '../store/villageStore';
const villageStore = useVillageStore()
const router = useRouter()

onMounted(() => {
    phaserStore.game = StartGame('game-container')
    EventBus.on('current-scene-ready', (scene_instance: any) => {
        phaserStore.scene = scene_instance
    });

    EventBus.on('change-village',(village: {villageId: number}) => {
        villageStore.currentVillageSelected = village.villageId
        router.push({name: "village"})
    } )


});

onUnmounted(() => {

    if (phaserStore.game)
    {
        phaserStore.game = null
    }

});


</script>

<template>
    <div id="game-container"></div>
</template>