<template>
	<header class="header">
		<div class="header__container container">
			<RouterLink class="header__logo" to="/">
				<img src="@/assets/logo.png" alt="Логотип онлайн-кинотеатра 'Маруся'" />
			</RouterLink>

			<TheNav />
			<SearchForm class="header__search" />

			<button v-if="!isAuthenticated" @click="openLogin" class="header__button">Войти</button>

			<RouterLink v-else to="/profile" class="header__button">
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
	import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
	import { storeToRefs } from 'pinia'
	import { RouterLink } from 'vue-router'

	import TheNav from './TheNav.vue'
	import SearchForm from './ui/SearchForm.vue'
	import LoginModal from '@/components/LoginModal.vue'
	import RegisterModal from '@/components/RegisterModal.vue'
	import ModalSuccess from '@/components/ModalSuccess.vue'

	import { useAuthStore } from '../stores/useAuthStore'
	import { useFavoritesStore } from '@/stores/useFavoritesStore'

	const authStore = useAuthStore()
	const { isAuthenticated } = storeToRefs(authStore)
	const favoritesStore = useFavoritesStore()

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

	watch(isAuthenticated, (val) => {
		if (val) favoritesStore.fetchFavorites()
	})

	const onOpenAuth = (e: Event) => {
		const custom = e as CustomEvent
		const mode = custom?.detail?.mode || 'login'
		if (mode === 'login') {
			isLoginOpen.value = true
		} else if (mode === 'register') {
			isRegisterOpen.value = true
		} else if (mode === 'success') {
			isSuccessOpen.value = true
		}
	}

	onMounted(() => {
		window.addEventListener('open-auth', onOpenAuth as EventListener)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('open-auth', onOpenAuth as EventListener)
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

			&:focus-visible {
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
				border-radius: 2px;
			}
		}

		&__search {
			margin-right: 80px;
		}

		&__button {
			font-family: var(--font-family);
			font-weight: 400;
			font-size: 24px;
			color: var(--color-white);
			transition: color 0.3s ease-in-out;
			background: transparent;
			border: none;
			cursor: pointer;

			&:hover {
				color: var(--color-hover);
			}

			&:active {
				color: var(--color-white);
			}

			&:focus-visible {
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
				border-radius: 2px;
			}
		}
	}
</style>
