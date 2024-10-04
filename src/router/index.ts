
import { createMemoryHistory, createRouter, RouterOptions } from 'vue-router'
import HomeView from './../components/HomeView.vue'
import MapView from './../components/MapView.vue'
import HqView from '../components/HqView.vue';
import { usePhaserStore } from '../store/phaserStore';
import { toRaw } from 'vue';

const routes: RouterOptions["routes"] = [
    { path: '/', name: "village",  component: HomeView, beforeEnter: () => {
        // change game scene to village view
        loadScene("Village")
    } },
    { path: '/map', component: MapView, beforeEnter: () => {
        // change game scene to map
        loadScene("Map")
     } 
    },
    { path: '/headquarter', name: "headquarter", component: HqView, beforeEnter: () => {
        hidePhaser()
    } }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router 



function loadScene(sceneName:string) {
    const phaserStore = usePhaserStore()
    const currentScene = toRaw(phaserStore.scene)

    phaserStore.shouldRender = true 

    if (currentScene && currentScene.scene.key !== sceneName) {
        currentScene.scene.start(sceneName)
    }
}

function hidePhaser() {
    const phaserStore = usePhaserStore()

    phaserStore.shouldRender = false 
}
