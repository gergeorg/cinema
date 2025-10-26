<script setup lang="ts">
	import { RouterView } from 'vue-router'
	import TheHeader from './components/TheHeader.vue'
	import TrailerModal from './components/ui/TrailerModal.vue'
	import TheFooter from './components/TheFooter.vue'

	import { useAuthStore } from '@/stores/useAuthStore'
	import { onMounted } from 'vue'

	onMounted(() => {
		const authStore = useAuthStore()
		authStore.fetchProfile()
	})
</script>

<template>
	<TheHeader />
	<main>
		<RouterView v-slot="{ Component }">
			<Transition name="page" mode="out-in">
				<component :is="Component" />
			</Transition>
		</RouterView>

		<TrailerModal />
	</main>
	<TheFooter />
</template>

<style scoped lang="scss">
	.page-enter-active,
	.page-leave-active {
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}
	.page-enter-from {
		opacity: 0;
		transform: translateY(20px);
	}
	.page-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}
</style>
