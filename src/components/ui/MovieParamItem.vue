<template>
	<li class="item">
		<span class="item__title">{{ title }}</span>
		<span class="item__dots"></span>
		<span class="item__value">{{ displayValue }}</span>
	</li>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	const props = defineProps<{
		title: string
		value?: string | number | null
	}>()

	const displayValue = computed(() => {
		const val = props.value
		if (val === null || val === undefined || val === '') {
			return 'нет данных'
		}
		return val
	})
</script>

<style scoped lang="scss">
	.item {
		max-width: 50%;
		display: flex;
		align-items: baseline;
		font-weight: 400;
		font-size: 18px;
		line-height: 133%;
		color: #fff;

		&__title {
			flex-shrink: 0;
			padding-right: 8px;
		}

		&__dots {
			flex-grow: 1;
			border-bottom: 1px dotted #fff;
			margin: 0 8px;
		}

		&__value {
			flex-shrink: 0;
			text-align: left;
			white-space: nowrap;
		}
	}
</style>
