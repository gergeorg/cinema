<template>
	<div v-if="visible" class="modal-overlay" @click.self="close">
		<div class="modal">
			<div class="modal__wrapper">
				<iframe
					class="modal__iframe"
					v-if="embedUrl"
					:src="embedUrl"
					width="100%"
					height="540"
					frameborder="0"
					allowfullscreen
					allow="autoplay; encrypted-media"
				></iframe>

				<button class="close-btn" @click="close">
					<BaseIcon name="close" size="24" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue'
	import BaseIcon from './BaseIcon.vue'

	const visible = ref(false)
	const trailerUrl = ref<string | null>(null)

	const open = (url: string) => {
		trailerUrl.value = url
		visible.value = true
	}
	const close = () => {
		visible.value = false
		trailerUrl.value = null
	}

	const embedUrl = computed(() => {
		if (!trailerUrl.value) return ''
		const match =
			trailerUrl.value.match(/v=([^&]+)/) || trailerUrl.value.match(/youtu\.be\/([^?&]+)/)
		return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : trailerUrl.value
	})

	onMounted(() => {
		const handleOpenTrailer = (e: Event) => {
			const ev = e as CustomEvent<string>
			if (ev && ev.detail) open(ev.detail)
		}

		window.addEventListener('open-trailer', handleOpenTrailer as EventListener)

		onUnmounted(() => {
			window.removeEventListener('open-trailer', handleOpenTrailer as EventListener)
		})
	})
</script>

<style scoped lang="scss">
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: var(--color-white);
		border-radius: 12px;
		width: 80%;
		width: 960px;

		&__wrapper {
			position: relative;
		}
	}

	.close-btn {
		position: absolute;
		top: 0;
		right: -72px;
		color: var(--color-white);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24px;
		width: 48px;
		height: 48px;
		background-color: var(--color-white);
	}
</style>
