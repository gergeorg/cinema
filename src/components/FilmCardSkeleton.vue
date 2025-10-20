<template>
	<li class="skeleton" aria-hidden="true"></li>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
	.skeleton {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		height: 336px;
		background: var(--skeleton-base-bg);
		max-width: 224px;
		width: 100%;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				90deg,
				var(--skeleton-shimmer-color-start) 0%,
				var(--skeleton-shimmer-color-mid) 50%,
				var(--skeleton-shimmer-color-end) 100%
			);
			transform: translateX(-100%);
			animation: shimmer var(--skeleton-shimmer-duration) infinite;
		}
	}
</style>
