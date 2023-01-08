<template>
	<ul class="task-control">
		<li v-for="item in tasklist">
			<span>任务名称: {{ item.taskname }} </span>
			<div class="container">
				<el-button type="primary" plain  @click="export_all(item.taskname, item.type)">导出全部数据</el-button>
				<el-button type="primary" plain  @click="export_over(item.taskname, item.type)">导出已确认数据</el-button>
				<el-button type="primary" plain  @click="delete_task(item.taskname)">删除任务</el-button>
			</div>
			
		</li>
	</ul>
</template>

<script lang="ts" setup>
	import { ref, reactive, computed, Ref, watch, inject } from 'vue'
	import { ElNotification } from 'element-plus'; 
	import { file_validation, download } from './file';

	let axios:any = inject('axios')
	let tasklist: Ref<any[]> = ref([])

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
	}
	init()

	let export_all = async function(taskname, tasktype){
		let res = await axios.post('/export/task', {
			'task_name':taskname,
			'export_type':'all'
		})
		// console.log(res, res.status)
		if(res.status == 200){
			// console.log(res.data.res)
			// console.log(tasktype)
			// console.log(file_validation[tasktype]['export'](res.data.res))
			let text = JSON.stringify(file_validation[tasktype]['export'](res.data.res), null, 4)
			let name = `${taskname}.json`
			download(text, name)
		}
	}

	let export_over = async function(taskname, tasktype){
		// console.log(taskname)
		let res = await axios.post('/export/task', {
			'task_name':taskname,
			'export_type':'over'
		})
		// console.log(res, res.status)
		if(res.status == 200){
			// console.log(res.data.res)
			// console.log(tasktype)
			// console.log(file_validation[tasktype]['export'](res.data.res))
			let text = JSON.stringify(file_validation[tasktype]['export'](res.data.res), null, 4)
			let name = `${taskname}.json`
			download(text, name)
		}
		
	}

	let delete_task = async function(taskname){
		let res = await axios.post('/task/delete', {
			'task_name':taskname,
		})
		// console.log(res, res.status)
		if(res.status == 200){
			ElNotification({
				title:'删除任务成功',
				message: '任务 '+ taskname + ' 已删除'
			})
		}
		location.reload();
	}
</script>

<style scoped>
	ul.task-control li {
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