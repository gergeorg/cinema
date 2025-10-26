<template>
	<label class="base-input" :for="id">
		<BaseIcon
			v-if="icon"
			:name="icon"
			:size="24"
			class="base-input__icon"
			:class="{ 'base-input__icon--error': error }"
		/>

		<input
			:id="id"
			:name="name"
			:type="type"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			:autocomplete="autocomplete"
			:autofocus="autofocus"
			:maxlength="maxlength"
			:minlength="minlength"
			class="base-input__field"
			:class="{
				'base-input__field--error': error,
				'base-input__field--with-icon': icon,
			}"
			v-model="model"
		/>
	</label>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import BaseIcon from '@/components/ui/BaseIcon.vue'

	interface Props {
		modelValue: string
		name?: string
		id?: string
		type?: string
		icon?: string | null
		placeholder?: string
		disabled?: boolean
		required?: boolean
		error?: boolean
		autocomplete?: string
		autofocus?: boolean
		maxlength?: number
		minlength?: number
	}

	const props = defineProps<Props>()
	const emit = defineEmits(['update:modelValue'])

	const model = computed({
		get: () => props.modelValue,
		set: (val: string) => emit('update:modelValue', val),
	})
</script>

<style scoped lang="scss">
	.base-input {
		position: relative;
		display: block;
		min-width: 100%;
		max-width: 340px;

		&__icon {
			position: absolute;
			top: 50%;
			left: 16px;
			transform: translateY(-50%);
			color: rgba(0, 0, 0, 0.4);
			pointer-events: none;
			transition: color 0.2s ease;

			&--error {
				color: #ff7575;
			}
		}

		&__field {
			width: 100%;
			border: 1px solid rgba(0, 0, 0, 0.4);
			border-radius: 8px;
			padding: 16px;
			color: var(--color-black);
			transition:
				border-color 0.2s ease,
				box-shadow 0.2s ease;

			&::placeholder {
				color: rgba(0, 0, 0, 0.4);
			}

			&--with-icon {
				padding-left: 52px;
			}

			&--error {
				border-color: #ff7575;
			}

			&:focus {
				outline: none;
				border-color: var(--color-hover);
				box-shadow: 0 0 0 2px rgba(180, 169, 255, 0.25);
			}
		}
	}
</style>
