<template>
	<div class="anno-task">
		<el-card class="box-card" v-for="item in dist_task">
			<template #header>
				<div class="card-header">
					<span>任务名: {{ item.taskname }}</span>
					<el-button class="button" type="primary" plain @click="anno(item.taskname, item.all)">进行标注</el-button>
				</div>
			</template>
			<ul class="task-message">
				<li>类型: {{ item.type }}</li>
				<li>完成: {{ item.over }}</li>
				<li>全部: {{ item.all }}</li>
			</ul>
		</el-card>
	</div>

</template>

<script lang="ts" setup>
	import { ref, Ref, inject, nextTick } from 'vue'
	import { useStore } from '../stores';
	import { useRouter } from 'vue-router';

	let axios: any = inject('axios')
	let router = useRouter()
	let store = useStore()

	let dist_task: Ref<any[]> = ref([])

	let init = async function(){
		let res = await axios.post('/task/dist', {
			user_name:store.username
		})
		dist_task.value = res.data.message
		// console.log('annotask')
	}
	init()

	let anno = async function(taskname: string, length: number){
		store.taskname = taskname
		store.tasklength = length
		await nextTick()
		router.push('/anno/data/'+taskname)
	}

</script>

<style scoped>
	div.anno-task {
		padding: 16px;
	}
	div.el-card {
		border-radius: 16px;
		margin-bottom: 16px;
	}
	div.card-header {
		display: flex;
		justify-content: space-between;
	}
	ul.task-message {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 0;
	}
	ul.task-message li {
		list-style: none;
		display: block;
		padding-right: 16px;
	}
</style>