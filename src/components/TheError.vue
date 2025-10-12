<template>
	<div class="container">
		<div class="error-component" v-if="message">
			<div class="error-icon">⚠️</div>
			<div class="error-message">{{ message }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		message: {
			type: String,
			required: true,
		},
	})
</script>

<style scoped>
	.error-component {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		background-color: #fff5f5;
		border: 1px solid #ffcccc;
		border-radius: 6px;
		color: #d32f2f;
		font-size: 20px;
		margin: 12px 0;
	}

	.error-icon {
		margin-right: 10px;
		font-size: 18px;
	}

	.error-message {
		word-break: break-word;
	}
</style>
