<template>
	<button
		class="button"
		:class="buttonClasses"
		:type="type"
		:aria-label="ariaLabel"
		:disabled="disabled"
		@click="$emit('click', $event)"
	>
		<!-- Иконка слева -->
		<BaseIcon
			v-if="icon && iconPosition === 'left'"
			:name="icon"
			:size="iconSize"
			class="button__icon"
			:class="{ 'button__icon--active': active }"
		/>

		<slot />

		<!-- Иконка справа -->
		<BaseIcon
			v-if="icon && iconPosition === 'right'"
			:name="icon"
			:size="iconSize"
			class="button__icon"
			:class="{ 'button__icon--active': active }"
		/>
	</button>
</template>

<script setup lang="ts">
	import { computed, type PropType } from 'vue'
	import BaseIcon from '@/components/ui/BaseIcon.vue'

	type ButtonType = 'button' | 'submit' | 'reset'
	type ButtonSize = 'default' | 'small' | 'big'
	type ButtonVariant = 'blue' | 'dark' | 'plain'

	const props = defineProps({
		variant: {
			type: String as PropType<ButtonVariant>,
			default: 'blue',
		},
		size: {
			type: String as PropType<ButtonSize>,
			default: 'default',
		},
		type: {
			type: String as PropType<ButtonType>,
			default: 'button',
		},
		icon: {
			type: String,
			default: null,
		},
		iconPosition: {
			type: String as PropType<'left' | 'right'>,
			default: 'left',
		},
		iconSize: {
			type: [Number, String],
			default: 24,
		},
		ariaLabel: {
			type: String,
			default: null,
		},
		active: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	})

	defineEmits(['click'])

	const buttonClasses = computed(() => [
		`button--${props.variant}`,
		`button--${props.size}`,
		{ 'button--active': props.active },
	])
</script>

<style scoped lang="scss">
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 18px;
		line-height: 133%;
		color: #fff;
		border-radius: 28px;
		transition:
			background-color 0.3s ease-in-out,
			color 0.3s ease-in-out,
			border-color 0.3s ease-in-out;

		&--blue {
			border: 1px solid #67a5eb;
			background-color: #67a5eb;

			&:hover,
			&:focus-visible {
				border-color: #45526e;
				background-color: #45526e;
				color: rgba(255, 255, 255, 0.5);
			}

			&:focus-visible {
				outline: 1px solid #b4a9ff;
				outline-offset: 1px;
			}
		}

		&--dark {
			border: 1px solid rgba(0, 0, 0, 0.4);
			background-color: #393b3c;

			&:hover,
			&:focus-visible {
				border-color: rgba(0, 0, 0, 0.4);
				background-color: #747474;
				color: rgba(255, 255, 255, 0.5);
			}

			&:focus-visible {
				outline: 1px solid #b4a9ff;
				outline-offset: 1px;
			}
		}

		&--plain {
			background: transparent;
			border: none;
			color: #45526e;
			padding: 0;
			font-weight: 500;
			border-radius: 0;

			&:hover,
			&:focus-visible {
				color: #b4a9ff;
				background: transparent;
			}

			&:focus-visible {
				outline: 1px solid #b4a9ff;
				outline-offset: 1px;
			}
		}

		&--default {
			padding: 0;
		}

		&--small {
			padding: 16px 22px;
		}

		&--big {
			padding: 16px 48px;
		}

		&__icon {
			display: inline-block;
			flex-shrink: 0;
			color: inherit;
			transition: color 0.3s ease-in-out;

			&:not(:last-child) {
				margin-right: 8px;
			}

			.button--plain & {
				margin-right: 8px;
			}
		}

		&--active {
			position: relative;
			pointer-events: none;

			&::after {
				content: '';
				position: absolute;
				bottom: -4px;
				left: 0;
				width: 100%;
				height: 1.5px;
				background-color: #dc5dfc;
			}
		}

		&:disabled {
			opacity: 0.6;
			pointer-events: none;
		}
	}
</style>
