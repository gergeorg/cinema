<template>
	<header class="header">
		<div class="header__container container">
			<RouterLink class="header__logo" to="/">
				<img src="../assets/logo.png" alt="Логотип онлайн-кинотеатра 'Маруся'" />
			</RouterLink>

			<TheNav />

			<SearchForm class="header__search" />
			<button class="header__button hover">Войти</button>
		</div>
	</header>
</template>

<script setup lang="ts">
	import TheNav from './TheNav.vue'
	import SearchForm from './ui/SearchForm.vue'

	import { RouterLink } from 'vue-router'
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

			&:hover {
				color: #b4a9ff;
			}

			&:active {
				color: #fff;
			}
		}
	}
</style>
