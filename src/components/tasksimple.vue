<template>
	<ul class="task-simple">
		<li v-for="item in props.tasklist">
			<span>任务名称: {{ item.taskname }} 任务类型: {{ type_name_map[item.type] }} </span>
			<el-button type="primary" plain  @click="to_details(item.taskname, item.type)">详情</el-button>
		</li>
	</ul>
</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, ref, Ref } from 'vue'
	import { type_name } from './file';

	let props = defineProps(['tasklist'])
	let emits = defineEmits(['call'])

	let type_name_map: Ref<any> = ref({})
	for(let item of type_name){
		type_name_map.value[item[0]] = item[1]
	}
	let to_details = function(taskname: string, tasktype: string){
		emits('call', taskname, tasktype)
	}
</script>

<style>
	ul.task-simple li {
		list-style: none;
		padding: 16px;
		margin-bottom: 16px;
		background-color: white;
		border-radius: 16px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		color: black;
	}
</style>