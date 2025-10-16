<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="close">
		<div class="modal-content">
			<header class="modal-header">
				<button class="close-btn" @click="close">
					<BaseIcon name="close" size="24" />
				</button>
			</header>

			<div class="modal-body">
				<img
					class="modal-logo"
					src="@/assets/small_logo.png"
					alt="Логотип онлайн-кинотеатра 'Маруся'"
				/>

				<h3 class="modal-title">{{ title }}</h3>

				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import BaseIcon from './BaseIcon.vue'

	defineProps<{
		isOpen: boolean
		title?: string
	}>()

	const emit = defineEmits<{
		(e: 'close'): void
	}>()

	const close = () => emit('close')
</script>

<style scoped>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal-content {
		background: #fff;
		border-radius: 24px;
		padding: 64px 40px;
		width: 420px;
		position: relative;
	}

	.modal-logo {
		display: block;
		margin: 0 auto 40px;
		width: 132px;
	}

	.close-btn {
		position: absolute;
		top: 0;
		right: -65px;
		cursor: pointer;
		border-radius: 24px;
		width: 48px;
		height: 48px;
		background: #fff;
	}

	.modal-title {
		font-weight: 700;
		font-size: 24px;
		line-height: 133%;
		color: #000;
		margin: 0 0 24px;
		text-align: center;
	}
</style>
