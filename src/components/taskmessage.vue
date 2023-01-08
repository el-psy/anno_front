<template>
	<div class="task-message">
		<!-- <el-button type="primary" plain  @click="com_change">创建任务</el-button>
		<div class="container">
			<Transition  name="fade" mode="out-in">
				<Component :is="com_computed"></Component>
			</Transition>
		</div> -->
		<Transition  name="fade" mode="out-in">
			<Component :is="com_name" v-bind="com_props" @call="func_call"></Component>
		</Transition>
	</div>
</template>

<script lang="ts" setup>
	import { ref, reactive, computed, Ref, watch, inject, shallowRef } from 'vue'
	import { ElNotification } from 'element-plus';
	import tasksimple from './tasksimple.vue'
	import stastic from './stastic/index.vue' 

	let axios:any = inject('axios')
	let tasklist: Ref<any[]> = ref([])
	let dist_value: Ref<any> = ref({})

	let init = async ()=>{
		tasklist.value = []
		let res = await axios.get('/task/get')
		if(res.status == 200){
			for(let item of res.data.message){
				item.tags = JSON.parse(item.tags)
				item.dist = []
				tasklist.value.push(item)
			}
		}
		res = await axios.post('/distrube/all')
		if(res.status == 200){
			for(let taskitem of tasklist.value){
				let taskname = taskitem['taskname']
				dist_value.value[taskname] = []
				for(let distitem of res.data.message){
					if(distitem['taskname'] == taskname){
						dist_value.value[taskname].push(distitem['username'])
					}
				}
			}
		}
	}
	init()

	let com_name = shallowRef(tasksimple)
	let com_props: Ref<any> = ref({
		tasklist: tasklist
	})
	let func_call = function(taskname: string, tasktype: string){
		if(com_name.value == tasksimple){
			com_name.value = stastic
			com_props.value = { taskname, tasktype, 'dist': dist_value.value[taskname] }
		}else if(com_name.value == stastic){
			com_name.value = tasksimple
			com_props.value = { tasklist: tasklist }
		}
	}
</script>

<style scoped>
	.fade-enter-active, .fade-leave-active {
		transition: transform 0.5s ease;
	}

	.fade-leave-to {
		/* opacity: 0; */
		transform: translateX(-100%);
	}
	.fade-enter-from {
		transform: translateX(100%);
	}

	div.task-message {
		margin: 20px;
		overflow: hidden;
	}
</style>