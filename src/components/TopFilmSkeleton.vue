<template>
	<div class="container top-film__container">
		<div class="top-film__info">
			<div class="skeleton skeleton--title"></div>
			<div class="skeleton skeleton--text"></div>
			<div class="skeleton skeleton--text short"></div>
			<div class="skeleton--buttons">
				<div class="skeleton skeleton--btn"></div>
				<div class="skeleton skeleton--btn"></div>
				<div class="skeleton skeleton--btn small"></div>
				<div class="skeleton skeleton--btn small"></div>
			</div>
		</div>

		<div class="top-film__poster">
			<div class="skeleton skeleton--poster"></div>
		</div>
	</div>
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
			width: 80%;
			height: 48px;
			margin: 16px 0;
		}

		&--text {
			width: 100%;
			height: 20px;

			&.short {
				width: 60%;
			}
		}

		&--buttons {
			display: flex;
			gap: 16px;
			margin-top: 40px;
			background-color: transparent;
		}

		&--btn {
			width: 140px;
			height: 48px;
			border-radius: 12px;

			&.small {
				width: 48px;
				height: 48px;
			}
		}

		&--poster {
			width: 100%;
			height: 552px;
			border-radius: 16px;
		}
	}
</style>
