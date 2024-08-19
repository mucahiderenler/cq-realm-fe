<script setup lang="ts">
import { onMounted, onUnmounted  } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import { usePhaserStore } from '../store/phaserStore';
const phaserStore = usePhaserStore()

onMounted(() => {
    phaserStore.game = StartGame('game-container')
    EventBus.on('current-scene-ready', (scene_instance: any) => {
        phaserStore.scene = scene_instance
    });


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