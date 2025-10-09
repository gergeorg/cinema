<template>
	<li class="film-card-skeleton" aria-hidden="true">
		<div class="skeleton__num" />
		<div class="skeleton__image" />
	</li>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
	.film-card-skeleton {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		height: 336px;
		background: rgba(255, 255, 255, 0.04);
		max-width: 224px;
		width: 100%;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0) 0%,
				rgba(255, 255, 255, 0.08) 50%,
				rgba(255, 255, 255, 0) 100%
			);
			transform: translateX(-100%);
			animation: shimmer 1.2s infinite;
		}

		.skeleton__num {
			position: absolute;
			top: 10px;
			left: 10px;
			width: 36px;
			height: 36px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.06);
			z-index: 1;
		}

		.skeleton__image {
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.03);
		}
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
