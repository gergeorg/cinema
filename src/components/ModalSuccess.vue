<template>
	<BaseModal :isOpen="isOpen" title="Регистрация завершена" @close="$emit('close')">
		<div class="modal-success">
			<p class="modal-success__text">Используйте вашу электронную почту для входа</p>

			<BaseButton
				class="modal-success__button"
				size="big"
				@click="$emit('open-login')"
				type="button"
			>
				Войти
			</BaseButton>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
	import BaseButton from './ui/BaseButton.vue'
	import BaseModal from './ui/BaseModal.vue'

	defineProps<{ isOpen: boolean }>()
	defineEmits(['close', 'open-login'])
</script>

<style scoped lang="scss">
	.modal-success {
		text-align: center;

		&__text {
			margin-bottom: 24px;
			text-align: center;
		}

		&__button {
			width: 100%;
		}
	}
</style>
