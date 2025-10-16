<template>
	<header class="header">
		<div class="header__container container">
			<RouterLink class="header__logo" to="/">
				<img src="@/assets/logo.png" alt="Логотип онлайн-кинотеатра 'Маруся'" />
			</RouterLink>

			<TheNav />
			<SearchForm class="header__search" />

			<button v-if="!isAuthenticated" @click="openLogin" class="header__button hover">Войти</button>

			<RouterLink v-else to="/profile" class="header__button hover">
				{{ authStore.user?.name }}
			</RouterLink>
		</div>

		<LoginModal
			:isOpen="isLoginOpen"
			@close="isLoginOpen = false"
			@open-register="switchToRegister"
		/>

		<RegisterModal
			:isOpen="isRegisterOpen"
			@close="isRegisterOpen = false"
			@open-login="switchToLogin"
			@register-success="showSuccessModal"
		/>

		<ModalSuccess
			:isOpen="isSuccessOpen"
			@close="isSuccessOpen = false"
			@open-login="switchToLogin"
		/>
	</header>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { RouterLink } from 'vue-router'

	import TheNav from './TheNav.vue'
	import SearchForm from './ui/SearchForm.vue'
	import LoginModal from '@/components/LoginModal.vue'
	import RegisterModal from '@/components/RegisterModal.vue'
	import ModalSuccess from '@/components/ModalSuccess.vue'

	import { useAuthStore } from '../stores/useAuthStore'

	const authStore = useAuthStore()
	const { isAuthenticated } = storeToRefs(authStore)

	const isLoginOpen = ref(false)
	const isRegisterOpen = ref(false)
	const isSuccessOpen = ref(false)

	const openLogin = () => {
		isLoginOpen.value = true
	}

	const switchToRegister = () => {
		isLoginOpen.value = false
		isRegisterOpen.value = true
	}
	const switchToLogin = () => {
		isRegisterOpen.value = false
		isLoginOpen.value = true
	}

	const showSuccessModal = () => {
		isRegisterOpen.value = false
		isSuccessOpen.value = true
	}

	onMounted(() => {
		authStore.fetchProfile()
	})
</script>

<style scoped lang="scss">
	.header {
		padding: 24px 0;

		&__container {
			display: flex;
			align-items: center;
		}

		&__logo {
			margin-right: 80px;
		}

		&__search {
			margin-right: 80px;
		}

		&__button {
			font-family: var(--font-family);
			font-weight: 400;
			font-size: 24px;
			line-height: 133%;
			color: #fff;
			transition: color 0.3s ease-in-out;
			background: transparent;
			border: none;
			cursor: pointer;

			&:hover {
				color: #b4a9ff;
			}

			&:active {
				color: #fff;
			}
		}
	}
</style>
