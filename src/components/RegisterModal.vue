<template>
	<BaseModal :isOpen="isOpen" title="Регистрация" @close="$emit('close')">
		<form v-if="!showSuccess" class="form" @submit.prevent="register">
			<div class="form__fields">
				<BaseInput
					class="form__input"
					v-model="email"
					name="email"
					type="email"
					icon="email"
					placeholder="Электронная почта"
					autocomplete="email"
					:error="!!error"
					required
				/>

				<BaseInput
					class="form__input"
					v-model="firstName"
					name="firstName"
					type="text"
					icon="user"
					placeholder="Имя"
					autocomplete="given-name"
					:error="!!error"
					required
				/>

				<BaseInput
					class="form__input"
					v-model="lastName"
					name="lastName"
					type="text"
					icon="user"
					placeholder="Фамилия"
					autocomplete="family-name"
					:error="!!error"
				/>

				<BaseInput
					class="form__input"
					v-model="password"
					name="password"
					type="password"
					icon="pass"
					placeholder="Пароль"
					:error="!!error"
					required
				/>

				<BaseInput
					class="form__input"
					v-model="confirmPassword"
					name="confirmPassword"
					type="password"
					icon="pass"
					placeholder="Подтвердите пароль"
					:error="!!error"
					required
				/>
			</div>

			<p v-if="error" class="form__error">{{ error }}</p>

			<BaseButton type="submit" size="big" class="form__button">Создать аккаунт</BaseButton>
			<BaseButton variant="plain" @click="$emit('open-login')" type="button">
				У меня есть пароль
			</BaseButton>
		</form>

		<ModalSuccess
			v-else
			:isOpen="showSuccess"
			@close="handleSuccessClose"
			@open-login="emits('open-login')"
		/>
	</BaseModal>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useAuthStore } from '../stores/useAuthStore'
	import BaseModal from '@/components/ui/BaseModal.vue'
	import BaseInput from './ui/BaseInput.vue'
	import BaseButton from './ui/BaseButton.vue'
	import ModalSuccess from './ModalSuccess.vue'

	defineProps<{ isOpen: boolean }>()
	const emits = defineEmits(['close', 'open-login'])

	const authStore = useAuthStore()

	const email = ref('')
	const firstName = ref('')
	const lastName = ref('')
	const password = ref('')
	const confirmPassword = ref('')
	const error = ref('')
	const showSuccess = ref(false)

	const register = async () => {
		error.value = ''

		if (password.value !== confirmPassword.value) {
			error.value = 'Пароли не совпадают'
			return
		}

		const ok = await authStore.registerUser({
			email: email.value,
			name: firstName.value,
			surname: lastName.value,
			password: password.value,
		})

		if (ok) {
			showSuccess.value = true
		} else {
			error.value = authStore.error || 'Ошибка регистрации'
		}
	}

	const handleSuccessClose = () => {
		showSuccess.value = false
		emits('close')
	}
</script>

<style scoped lang="scss">
	.form {
		display: flex;
		flex-direction: column;

		&__fields {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 24px;
		}

		&__button {
			margin-bottom: 24px;
		}

		&__error {
			color: #ff6b6b;
			font-size: 14px;
			margin-top: 4px;
		}
	}
</style>
