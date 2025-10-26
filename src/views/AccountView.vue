<script setup lang="ts">
	import AccountFavorites from '@/components/AccountFavorites.vue'
	import AccountSettings from '@/components/AccountSettings.vue'
	import BaseButton from '@/components/ui/BaseButton.vue'
	import { ref, computed, onMounted, onUnmounted } from 'vue'

	const activeTab = ref<'settings' | 'favorites'>('favorites')
	const isMobile = ref(false)

	const checkWidth = () => {
		isMobile.value = window.innerWidth <= 640
	}

	onMounted(() => {
		checkWidth()
		window.addEventListener('resize', checkWidth)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', checkWidth)
	})

	const favoritesLabel = computed(() => (isMobile.value ? 'Избранное' : 'Избранные фильмы'))

	const settingsLabel = computed(() => (isMobile.value ? 'Настройки' : 'Настройка аккаунта'))
</script>

<template>
	<div class="container">
		<h1 class="account__title">Мой аккаунт</h1>

		<ul class="account__tabs">
			<li>
				<BaseButton
					variant="plain"
					icon="favorite"
					type="button"
					class="account__tab"
					@click="activeTab = 'favorites'"
					:active="activeTab === 'favorites'"
				>
					{{ favoritesLabel }}
				</BaseButton>
			</li>

			<li>
				<BaseButton
					variant="plain"
					icon="user"
					type="button"
					class="account__tab"
					@click="activeTab = 'settings'"
					:active="activeTab === 'settings'"
				>
					{{ settingsLabel }}
				</BaseButton>
			</li>
		</ul>

		<AccountSettings v-if="activeTab === 'settings'" />
		<AccountFavorites v-else />
	</div>
</template>

<style scoped lang="scss">
	.account {
		&__title {
			margin: 0 0 64px;
			font-weight: 700;
			font-size: 48px;
			line-height: 117%;
			color: var(--color-white);

			@media (max-width: 640px) {
				margin: 0 0 40px;
				font-size: 24px;
			}
		}

		&__tabs {
			display: flex;
			gap: 64px;
			margin-bottom: 64px;

			@media (max-width: 640px) {
				gap: 24px;
			}
		}

		&__tab {
			font-weight: 400;
			font-size: 24px;
			color: var(--color-white);
			position: relative;
			padding: 0;
			cursor: pointer;
		}
	}
</style>
