<template>
	<footer class="footer">
		<div class="container">
			<ul class="footer__social-list">
				<li class="footer__social-item">
					<a
						href="https://vk.com/"
						class="footer__social-link"
						aria-label="Наша страница в VK"
						target="_blank"
					>
						<BaseIcon width="19" height="11" name="vk" />
					</a>
				</li>

				<li class="footer__social-item">
					<a
						href="https://www.youtube.com/"
						class="footer__social-link"
						aria-label="Наш youtube канал"
						target="_blank"
					>
						<BaseIcon width="16" height="12" name="yt" />
					</a>
				</li>

				<li class="footer__social-item">
					<a
						href="https://ok.ru/"
						class="footer__social-link"
						aria-label="Наша страница в одноклассниках"
						target="_blank"
					>
						<BaseIcon width="12" height="19" name="ok" />
					</a>
				</li>

				<li class="footer__social-item">
					<a
						href="https://telegram.org/"
						class="footer__social-link"
						aria-label="Наш канал в telegtam"
						target="_blank"
					>
						<BaseIcon width="17" height="15" name="tg" />
					</a>
				</li>
			</ul>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import BaseIcon from './ui/BaseIcon.vue'
</script>

<style scoped lang="scss">
	.footer {
		padding: 40px 0;

		&__social-list {
			display: flex;
			justify-content: flex-end;
			gap: 24px;
		}

		&__social-icon {
			color: var(--color-white);
			transition: color 0.3s ease-in-out;
		}

		&__social-link {
			width: 36px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			border: 1px solid rgba(255, 255, 255, 0.8);
			transition: border 0.3s ease-in-out;

			&:hover {
				border: 1px solid var(--color-hover);

				.icon {
					color: var(--color-hover);
				}
			}

			&:focus-visible {
				outline: 1px solid var(--color-hover);
				outline-offset: 4px;
			}
		}

		.icon {
			color: var(--color-white);
			transition: color 0.3s ease-in-out;
		}
	}
</style>
