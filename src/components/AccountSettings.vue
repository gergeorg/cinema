<template>
	<div class="account">
		<div class="account__wrapper">
			<div class="account__avatar account__initials">{{ initials }}</div>
			<span class="account__title">Имя Фамилия</span>
			<span class="account__value">{{ `${user?.name} ${user?.surname}` }}</span>
		</div>

		<div class="account__wrapper">
			<div class="account__avatar account__icon"></div>
			<span class="account__title">Электронная почта</span>
			<span class="account__value">{{ user?.email }}</span>
		</div>
	</div>

	<BaseButton variant="blue" size="big" @click="logout">Выйти из аккаунта</BaseButton>
</template>

<script setup lang="ts">
	import { useAuthStore } from '../stores/useAuthStore'
	import type { IUser } from '@/types'
	import { storeToRefs } from 'pinia'
	import { computed } from 'vue'
	import BaseButton from './ui/BaseButton.vue'

	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	const initials = computed<string>(() => {
		const u = user.value as IUser | null
		if (!u) return ''
		const first = u.name?.[0]?.toUpperCase() ?? ''
		const last = u.surname?.[0]?.toUpperCase() ?? ''
		return first + last
	})

	const logout = async () => {
		await authStore.logout()
	}
</script>

<style scoped lang="scss">
	.account {
		margin-bottom: 64px;
		display: flex;
		flex-direction: column;
		gap: 40px;
		max-width: 50%;

		&__wrapper {
			display: grid;
			grid-template-columns: 60px 1fr;
			grid-template-rows: 1fr 1fr;
			gap: 4px 16px;
			grid-template-areas:
				'icon title'
				'icon value';
		}

		&__avatar {
			grid-area: icon;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 30px;
			width: 60px;
			height: 60px;
			background: rgba(255, 255, 255, 0.5);
			font-weight: 700;
			font-size: 24px;
			line-height: 133%;
			color: #fff;
		}

		&__title {
			grid-area: title;
			align-self: end;
			font-weight: 400;
			font-size: 18px;
			line-height: 133%;
			color: #fff;
		}

		&__value {
			grid-area: value;
			font-weight: 700;
			font-size: 24px;
			line-height: 133%;
			color: #fff;
		}
	}
</style>
