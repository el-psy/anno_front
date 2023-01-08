<template>
	<router-view></router-view>
</template>

<script lang="ts" setup>
	import { useRouter, useRoute } from 'vue-router';
	let router = useRouter();
	let route = useRoute()
	// console.log(router)
	// console.log(route)
</script>

<style>
	div#app {
		min-width: 100vw;
		height: 100vh;
		padding: 0;
	}
</style>