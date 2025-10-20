<script setup lang="ts">
	import AccountFavorites from '@/components/AccountFavorites.vue'
	import AccountSettings from '@/components/AccountSettings.vue'
	import BaseButton from '@/components/ui/BaseButton.vue'
	import { ref } from 'vue'

	const activeTab = ref<'settings' | 'favorites'>('favorites')
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
					Избранные фильмы
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
					Настройка аккаунта
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
		}

		&__tabs {
			display: flex;
			gap: 64px;
			margin-bottom: 64px;
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
