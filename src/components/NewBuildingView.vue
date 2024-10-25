<script setup lang="ts">
import { onMounted } from 'vue';



onMounted(() => {
    console.log("New building view is alive!!")
})

</script>

<template>

<div>
  <BButton>Button</BButton>
  <BButton variant="danger">Button</BButton>
  <BButton variant="success">Button</BButton>
  <BButton variant="outline-primary">Button</BButton>
</div>



</template>