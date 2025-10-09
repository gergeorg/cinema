<template>
	<svg
		class="icon"
		:class="[`icon--${name}`, customClass]"
		:width="width"
		:height="height"
		aria-hidden="true"
	>
		<use :href="`${spriteUrl}#icon-${name}`"></use>
	</svg>
</template>

<script setup lang="ts">
	const spriteUrl = new URL('@/assets/sprite.svg', import.meta.url).href

	const {
		name,
		width,
		height,
		class: customClass,
	} = defineProps({
		name: { type: String, required: true },
		width: { type: [Number, String], default: 24 },
		height: { type: [Number, String], default: 24 },
		class: { type: [String, Array, Object], default: '' },
	})
</script>

<style scoped>
	.icon {
		display: inline-block;
		flex-shrink: 0;
		color: inherit;
	}
</style>
