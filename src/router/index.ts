
import { createMemoryHistory, createRouter, RouterOptions } from 'vue-router'
import HomeView from './../components/HomeView.vue'
import MapView from './../components/MapView.vue'
import { usePhaserStore } from '../store/phaser';
import { toRaw } from 'vue';

const routes: RouterOptions["routes"] = [
    { path: '/', component: HomeView, beforeEnter: () => {
        // change game scene to village view
        loadScene("Village")
    } },
    { path: '/map', component: MapView, beforeEnter: () => {
        // change game scene to map
        loadScene("Map")
     } 
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router 



function loadScene(sceneName:string) {
    const phaserStore = usePhaserStore()
    const currentScene = toRaw(phaserStore.scene)

    if (currentScene && currentScene.scene.key !== sceneName) {
        currentScene.scene.start(sceneName)
    }
}