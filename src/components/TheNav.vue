<template>
	<nav class="nav">
		<ul class="nav__list">
			<li class="nav__item">
				<RouterLink class="nav__link" activeClass="nav__link--active" to="/">Главная</RouterLink>
			</li>

			<li class="nav__item">
				<RouterLink class="nav__link" activeClass="nav__link--active" to="/genres"
					>Жанры</RouterLink
				>
			</li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
	import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
	.nav {
		margin-right: 40px;

		&__list {
			display: flex;
			gap: 40px;
		}

		&__item {
			font-weight: 400;
			font-size: 24px;
			color: var(--color-white);
		}

		&__link {
			font-weight: 400;
			font-size: 24px;
			color: var(--color-white);
			transition: color 0.3s ease-in-out;

			&:hover {
				color: var(--color-hover);
			}

			&:focus-visible {
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
				border-radius: 2px;
			}

			&--active {
				position: relative;
				pointer-events: none;

				&::after {
					content: '';
					display: block;
					position: absolute;
					bottom: -8px;
					left: 0;
					right: 0;
					width: 100%;
					height: 1.5px;
					background-color: #dc5dfc;
				}
			}
		}
	}
</style>
