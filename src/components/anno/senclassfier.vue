<template>
	<div>
		{{ props.data }}
	</div>

</template>

<script lang="ts" setup>
	import { defineProps } from 'vue';
	let props = defineProps(['data', 'task_base'])
</script>

<style scoped>

</style>