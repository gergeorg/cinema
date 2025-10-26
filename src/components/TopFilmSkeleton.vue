<template>
	<div class="skeleton__container container">
		<div class="skeleton__info">
			<div class="skeleton skeleton__title"></div>
			<div class="skeleton skeleton__text short"></div>
			<div class="skeleton skeleton__text short"></div>

			<div class="skeleton__buttons">
				<div class="skeleton skeleton__btn"></div>
				<div class="skeleton skeleton__btn"></div>
				<div class="skeleton skeleton__btn small"></div>
				<div class="skeleton skeleton__btn small"></div>
			</div>
		</div>

		<div class="skeleton__poster skeleton"></div>
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

		&__container {
			display: flex;
			gap: 40px;

			@media (max-width: 768px) {
				flex-direction: column;
			}
		}

		&__info {
			@media (max-width: 768px) {
				order: 2;
			}
		}

		&__title {
			width: 80%;
			height: 48px;
			margin: 16px 0;
		}

		&__text {
			width: 100%;
			height: 20px;

			&.short {
				width: 60%;
			}
		}

		&__buttons {
			display: flex;
			gap: 16px;
			margin-top: 40px;
			background-color: transparent;
		}

		&__btn {
			width: 140px;
			height: 48px;
			border-radius: 12px;

			&.small {
				width: 48px;
				height: 48px;
			}
		}

		&__poster {
			width: 100%;
			height: 552px;
			border-radius: 16px;

			@media (max-width: 768px) {
				order: 1;
				height: 250px;
			}
		}
	}
</style>
