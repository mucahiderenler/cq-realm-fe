<script setup lang="ts">
import { onMounted } from 'vue';
import { EventBus } from './EventBus';
import StartGame from './main';
import { usePhaserStore } from '../store/phaserStore';
import { useRouter } from 'vue-router';
import { useVillageStore } from '../store/villageStore';
import { Building } from './types/village';

const phaserStore = usePhaserStore()
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

    EventBus.on('go-building',(building: Building) => {
        router.push({name: 'building', params: {buildingId: building.buildingID}})
    })

});



</script>

<template>
    <div v-show="phaserStore.shouldRender" id="game-container"></div>
</template>