<template>
	<section class="about-film">
		<div class="about-film__container container">
			<h2 class="skeleton skeleton--title"></h2>

			<ul class="skeleton--list">
				<li v-for="i in 6" :key="i" class="skeleton skeleton--item"></li>
			</ul>
		</div>
	</section>
</template>

<style scoped lang="scss">
	.skeleton {
		position: relative;
		overflow: hidden;
		background: var(--skeleton-base-bg);
		border-radius: 8px;
		margin-bottom: 12px;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				90deg,
				var(--skeleton-shimmer-color-start) 0%,
				var(--skeleton-shimmer-color-mid) 50%,
				var(--skeleton-shimmer-color-end) 100%
			);
			transform: translateX(-100%);
			animation: shimmer var(--skeleton-shimmer-duration) infinite;
		}

		&--title {
			width: 250px;
			height: 48px;
		}

		&--list {
			width: 50%;
		}

		&--item {
			height: 25px;
		}
	}
</style>
