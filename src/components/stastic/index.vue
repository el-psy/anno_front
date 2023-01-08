<template>
	<div class="task-stastic">
		<el-button type="primary" plain  @click="to_simple">返回</el-button>
		<div class="base">
			<span>任务名称: {{ props.taskname }}</span>
			<span>任务类型: {{ type_name_map[props.tasktype] }}</span>
			<span>数据数量: {{ taskdata.length }}</span>
		</div>
		<div class="dist">
			<span class="title">分配到此任务的用户: </span>
			<div class="user">
				<el-tag v-for="item in props.dist" size="large">{{ item }}</el-tag>
			</div>
		</div>
		<Component :is="com_map[props.tasktype]" :taskdata="taskdata" :taskbase="taskbase"></Component>
	</div>

</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, ref, Ref, inject } from 'vue'
	import { type_name } from '../file';
	import nodestastic from './nodestastic.vue'
	import relationstastic from './relationstastic.vue';
	import senclassfier from '../anno/senclassfier.vue';
	import textgenstastic from './textgenstastic.vue';

	let axios: any = inject('axios')
	let props = defineProps(['taskname', 'tasktype', 'dist'])
	let emits = defineEmits(['call'])
	let to_simple = function(){
		emits('call')
	}

	let type_name_map: Ref<any> = ref({})
	for(let item of type_name){
		type_name_map.value[item[0]] = item[1]
	}
	let com_map = {
		'node': nodestastic,
		'relation': relationstastic,
		'sentence_classifier': senclassfier,
		'text_generation': textgenstastic
	}

	let taskbase = ref({})
	let taskdata: Ref<any> = ref([])
	let init = async function(){
		let res = await axios.post('/task/base', {
			task_name: props.taskname
		})
		if(res.status == 200){
			taskbase.value = res.data.data
		}
		
		res = await axios.post('/anno/get', {
			task_name: props.taskname
		})
		if(res.status == 200){
			taskdata.value = res.data['anno_data']
		}
	}
	init()
</script>

<style scoped>
	div.task-stastic > * {
		margin-bottom: 16px;
	}

	div.task-stastic div.base {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		padding: 16px;
		border-radius: 16px;
		background-color: white;
		color: black;
	}

	div.task-stastic div.dist {
		padding: 16px;
		border-radius: 16px;
		background-color: white;
		color: black;
	}
	div.task-stastic div.dist span.title {
		display: inline-block;
		padding-bottom: 16px;
	}
	div.task-stastic div.dist div.user {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	div.task-stastic div.dist div.user > * {
		margin-right: 16px;
	}
</style>