<template>
	<main>
		<RouterView></RouterView>
	</main>
</template>

<script lang="ts" setup>
	import { RouterView } from 'vue-router';
</script>

<style scoped>
	main {
		flex: 1 1 0;
		height: 100%;

		background-color: rgba(176, 92, 124, 0.5);
		backdrop-filter: blur(4px);
		overflow: auto;
	}
</style>