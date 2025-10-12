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
		background: rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		margin-bottom: 12px;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: -150px;
			height: 100%;
			width: 150px;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
			animation: shimmer 1.2s infinite;
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

	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
</style>
