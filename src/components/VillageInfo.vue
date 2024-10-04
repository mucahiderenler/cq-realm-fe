<script setup lang="ts">
import { useVillageStore } from '../store/villageStore';
const store = useVillageStore()
</script>

<template>
       {{store.village?.name}} - Position ({{ store.village?.x }}, {{ store.village?.y }})
        Wood: {{ store.resources?.wood }} - Clay: {{ store.resources?.clay }} - Iron: {{store.resources?.iron}}
</template>
