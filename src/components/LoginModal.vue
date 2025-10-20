<template>
	<BaseModal :isOpen="isOpen" @close="$emit('close')">
		<form class="form" @submit.prevent="login">
			<BaseInput
				v-model="email"
				type="email"
				icon="email"
				placeholder="Электронная почта"
				autocomplete="email"
				:error="!!error"
				class="form__input--email"
				name="email"
				required
			/>

			<BaseInput
				v-model="password"
				type="password"
				icon="pass"
				placeholder="Пароль"
				:error="!!error"
				class="form__input--pass"
				name="password"
				required
			/>

			<p v-if="error" class="form__error">{{ error }}</p>

			<BaseButton type="submit" size="big" class="form__button">Войти</BaseButton>
			<BaseButton variant="plain" @click="$emit('open-register')" type="button">
				Регистрация
			</BaseButton>
		</form>
	</BaseModal>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useAuthStore } from '../stores/useAuthStore'
	import BaseModal from './ui/BaseModal.vue'
	import BaseButton from './ui/BaseButton.vue'
	import BaseInput from './ui/BaseInput.vue'

	defineProps<{
		isOpen: boolean
	}>()

	const emit = defineEmits<{
		(e: 'close'): void
		(e: 'open-register'): void
	}>()

	const email = ref('')
	const password = ref('')
	const error = ref<string | null>(null)

	const authStore = useAuthStore()

	const login = async () => {
		error.value = null
		const ok = await authStore.login({ email: email.value, password: password.value })
		if (!ok) error.value = authStore.error
		else emit('close')
	}
</script>

<style scoped lang="scss">
	.form {
		display: flex;
		flex-direction: column;

		&__input {
			&--email {
				margin-bottom: 12px;
			}

			&--pass {
				margin-bottom: 24px;
			}
		}

		&__button {
			margin-bottom: 24px;
		}

		&__error {
			margin-bottom: 10px;
			color: var(--color-error);
		}
	}
</style>
