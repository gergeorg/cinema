<script setup lang="ts">
	import { RouterView } from 'vue-router'
	import TheHeader from './components/TheHeader.vue'
	import TrailerModal from './components/ui/TrailerModal.vue'
	import TheFooter from './components/TheFooter.vue'
</script>

<template>
	<TheHeader />
	<main>
		<RouterView />
		<TrailerModal />
	</main>
	<TheFooter />
</template>

<style scoped></style>
