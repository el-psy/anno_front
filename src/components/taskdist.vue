<template>
	<div class="task-dist">
		<div class="dist-item">
			<el-collapse v-model="choiced_task_key" @change="handleChange" accordion>
				<el-collapse-item v-for="(item, index) in tasklist" :title="'任务 '+item.taskname" :name="index">
					<el-transfer v-model="dist_value" :data="users"  :titles="['未分配到此任务','分配到此任务']"/>
					<el-button type="primary" plain  @click="dist_update(item.taskname)">提交分配数据</el-button>
				</el-collapse-item>

			</el-collapse>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, reactive, computed, Ref, watch, inject } from 'vue'
	import { ElNotification } from 'element-plus';

	let axios:any = inject('axios')

	let tasklist: Ref<any[]> = ref([])
	let users = ref([]);
	const dist_value = ref([])

	let init = async ()=>{
		tasklist.value = []
		let res = await axios.get('/task/get')
		for(let item of res.data.message){
			item.tags = JSON.parse(item.tags)
			item.dist = []
			tasklist.value.push(item)
		}
		// console.log(res)

		res = await axios.post('/auth/get')
		// console.log(res)
		users.value = res.data.message.filter((item: any)=> item.actor=='plain').map((item: any)=> ({
			'key': item.username,
			'label': item.username,
			'disabled': false
		}))
		// console.log(users.value)

		res = await axios.post('/distrube/all')
		for(let task_item of tasklist.value){
			for(let item of res.data.message){
				if(item.taskname == task_item.taskname){
					task_item.dist.push(item.username)
				}
			}
		}

		dist_value.value = tasklist.value[0].dist
	}
	init()

	let dist_update = async function(taskname: string){
		console.log(taskname, dist_value.value)

		let res = await axios.post('/distrube/set', {
			task_name: taskname,
			users: dist_value.value
		})
		if(res.data.message == 'OK' && res.status == 200){
			ElNotification({
				title:'任务分配成功',
				message: '分配数据已提交'
			})
		}
		init()
	}

	const choiced_task_key = ref(0)
	const handleChange = (val: string) => {
		// console.log(val,typeof(val))
		if(val != ''){
			console.log(tasklist.value[val])
			dist_value.value = tasklist.value[val].dist
		}
		// console.log(tasklist.value[val[0]])
	}

	interface Option {
		key: number
		label: string
		disabled: boolean
	}

	
</script>

<style>
	div.task-dist div.dist-item {
		margin: 16px;
		border-radius: 12px;
		overflow: hidden;
		/* padding: 16px; */
	}

	div.task-dist div.dist-item div.el-collapse-item__header {
		padding: 0 16px;
	}

	div.task-dist div.dist-item div.el-collapse-item__content {
		padding: 16px;
	}

	div.task-dist div.dist-item div.el-collapse-item__content button.el-button {
		margin-top: 16px;
	}
</style>