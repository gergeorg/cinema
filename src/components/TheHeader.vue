<template>
	<header class="header">
		<div class="header__container container">
			<RouterLink class="header__logo" to="/">
				<img src="@/assets/img/logo.svg" alt="Логотип онлайн-кинотеатра 'Маруся'" />
			</RouterLink>

			<div class="header__controls">
				<TheNav />

				<BaseButton
					type="button"
					variant="plain"
					class="header__mobile-search mobile-only"
					aria-label="Открыть поиск"
					@click.stop="openMobileSearch"
				>
					<BaseIcon name="search" width="24" height="24" />
				</BaseButton>

				<SearchForm class="header__search" v-model:overlayOpen="mobileSearchOpen" />

				<button v-if="!isAuthenticated" @click="openLogin" class="header__button">
					<span class="desktop-only">Войти</span>
					<BaseIcon class="mobile-only" name="user" width="24" height="24" />
				</button>

				<RouterLink v-else to="/profile" class="header__button">
					<span class="desktop-only">{{ authStore.user?.name }}</span>
					<BaseIcon class="mobile-only" name="user" width="24" height="24" />
				</RouterLink>
			</div>
		</div>

		<Teleport to="body">
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
		</Teleport>
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
	import BaseIcon from './ui/BaseIcon.vue'
	import BaseButton from './ui/BaseButton.vue'

	const authStore = useAuthStore()
	const { isAuthenticated } = storeToRefs(authStore)
	const favoritesStore = useFavoritesStore()

	const isLoginOpen = ref(false)
	const isRegisterOpen = ref(false)
	const isSuccessOpen = ref(false)
	const mobileSearchOpen = ref(false)

	const openMobileSearch = () => {
		mobileSearchOpen.value = true
		window.dispatchEvent(new CustomEvent('open-search-overlay'))
	}

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
		z-index: 1000;

		backdrop-filter: blur(20px);
		isolation: isolate;
		background: rgba(0, 0, 0, 0.5);

		@media (max-width: 768px) {
			padding: 16px 0;
		}

		&__container {
			display: flex;
			align-items: center;
			gap: 80px;
			justify-content: space-between;

			@media (max-width: 768px) {
			}
		}

		&__controls {
			display: grid;
			grid-template-columns: 1fr minmax(0, 655px) auto;
			align-items: center;

			@media (max-width: 768px) {
				grid-template-columns: repeat(3, 24px);
				justify-items: end;
				align-items: center;
				gap: 20px;
			}
		}

		&__logo {
			img {
				@media (max-width: 768px) {
					width: 136px;
					height: 18px;
				}
			}

			&:focus-visible {
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
				border-radius: 2px;
			}
		}

		&__search {
			margin-right: 80px;

			@media (max-width: 768px) {
				margin-right: 0;
			}
		}

		&__mobile-search {
			fill: var(--color-white);
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
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: inline-block;

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

		.mobile-only {
			display: none;

			@media (max-width: 768px) {
				display: block;
			}
		}

		.desktop-only {
			@media (max-width: 768px) {
				display: none;
			}
		}
	}
</style>
