<template>
	<form class="search">
		<input
			type="search"
			class="search__input"
			name="search"
			id="search-input"
			placeholder="Поиск"
		/>
		<button type="submit" class="search__button" aria-label="Искать">
			<BaseIcon width="25" height="24" name="search" />
		</button>
	</form>
</template>

<script setup lang="ts">
	import BaseIcon from './BaseIcon.vue'
</script>

<style scoped lang="scss">
	.search {
		position: relative;

		&:focus-within,
		&:hover {
			.search__button {
				svg {
					fill: #b4a9ff;
					fill-opacity: 1;
				}
			}
		}

		&__input {
			border-radius: 8px;
			width: 655px;
			padding: 12px 16px 12px 52px;
			background-color: #393b3c;
			border: none;
			outline: none;

			font-family: inherit;
			font-weight: 400;
			font-size: 18px;
			line-height: 133%;
			color: #fff;

			&:focus-visible,
			&:active {
				outline: 1px solid #b4a9ff;
			}
		}

		&__button {
			padding: 0;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 16px;
			outline: none;
			background: none;
			border: none;
			cursor: pointer;

			svg {
				fill: #fff;
				fill-opacity: 0.5;
			}

			&:focus-visible,
			&:active {
				svg {
					fill: #b4a9ff;
					fill-opacity: 1;
				}
			}
		}
	}
</style>
