<template>
	<div>
		<div class="box-card">
			初始化中
		</div>
	</div>

</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, computed, ref, onMounted, onUnmounted } from 'vue';
	import { ElNotification } from 'element-plus';

	let props = defineProps(['data', 'task_base'])
	// let {data, task_base} = props
	let emit = defineEmits(['change'])

</script>

<style scoped>
	.box-card {
		margin: 16px;
		padding: 16px;
		background: white;
		color: black;
		border-radius: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

</style>