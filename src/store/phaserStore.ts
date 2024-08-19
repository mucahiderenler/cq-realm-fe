import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhaserStore = defineStore('phaser', () => {
    const game = ref()
    const scene = ref()

    return {game, scene}
})