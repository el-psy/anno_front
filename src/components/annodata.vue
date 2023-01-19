<template>
	<div class="anno-data">
		<aside class="anno-aside">
			<!-- <ul>
				<li v-for="(item, index) in anno_data.slice(start_index, end_index)">
					{{ item.taskid }}{{ item.update }}{{ item.overmark }}{{ index }}
				</li>
			</ul> -->
			<el-button type="success" plain class="update" @click="anno_update">提交数据</el-button>
			<table>
				<thead>
					<th>任务序号</th>
					<th>待提交</th>
					<th>待确认</th>
				</thead>
				<tbody>
					<tr v-for="(item, index) in anno_data.slice(start_index, end_index)" @click="change_now(index+start_index)">
						<td>{{ index+start_index }}</td>
						<td><Boolean :bool="!item.update"></Boolean></td>
						<td><Boolean :bool="item.overmark == 0"></Boolean></td>
					</tr>
				</tbody>
			</table>
		</aside>
		<div class="anno-main">
			<div class="anno-head">
				<ul>
					<li>
						任务名: {{ taskname }}
					</li>
					<li>
						待提交: {{ un_updated }}
					</li>
					<li>
						待确认: {{ un_over }}
					</li>
					<li>
						任务总数: {{ tasklength }}
					</li>
					<li>
						当前页起始序号: {{ start_index }}
					</li>
					<li>
						当前页结束序号: {{ Math.min(end_index, tasklength) }}
					</li>
				</ul>
				<hr />
				<ul>
					<li>
						前一项: 
						<el-button type="primary" plain @click="prev_index">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
							</svg>

						</el-button>
					</li>
					<li>
						当前项: {{ current_index }}
					</li>
					<li>
						后一项: 
						<el-button type="primary" plain @click="next_index">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
							</svg>

						</el-button>
					</li>
				</ul>
			</div>
			<div class="anno-core">
				<Component :is="anno_name" :data="anno_data[current_index]" :task_base="task_base" @change="anno_change"></Component>
			</div>
			<div class="anno-footer">
				<el-pagination
				v-model:current-page="current_page"
				v-model:page-size="page_size"
				:page-sizes="[20, 30, 50, 100]"
				:small="false"
				:disabled="false"
				:background="true"
				layout="sizes, prev, pager, next, jumper"
				:total="tasklength"
				:pager-count="5"
			/>
			</div>
		</div>
		
	</div>
</template>

<script lang="ts" setup>
	import { useRoute } from 'vue-router';
	import { useStore } from '../stores';
	import { inject, ref, Ref, computed, watch, nextTick, shallowRef } from 'vue';
	import Boolean from './boolean.vue'
	import Simple from './anno/simple.vue'
	import Node_anno from './anno/nodeanno.vue';
	import Rel_anno from './anno/relationanno.vue'
	import Sencla_anno from './anno/senclassfier.vue'
	import Textgen_anno from './anno/textgen.vue'
	import { ElNotification } from 'element-plus';

	let route = useRoute()
	let { taskname } = route.params

	let store = useStore()
	let { tasklength } = store
	// console.log(route.params)

	let axios: any = inject('axios')

	let anno_data: Ref<any[]> = ref([])
	let un_updated = computed(()=>{
		let res = 0;
		anno_data.value.map((item)=>{
			if(item.update == false){
				res += 1
			}
		})
		return res
	})
	let un_over = computed(()=>{
		let res = 0;
		anno_data.value.map((item)=>{
			if(item.overmark == 0){
				res += 1
			}
		})
		return res
	})

	let task_base = ref({'type':'', 'tags':''})
	let anno: any = {
		'simple': Simple,
		'node': Node_anno,
		'relation':Rel_anno,
		'sentence_classifier':Sencla_anno,
		'text_generation':Textgen_anno
	}
	let anno_name = shallowRef(Simple)
	let init = async function(){
		let res = await axios.post('/anno/get', {
			task_name: taskname
		})
		// console.log(res)
		anno_data.value = res.data.anno_data.map((item: any)=>{
			item.update = true; return item;
		})
		res = await axios.post('/task/base', {
			task_name: taskname
		})
		// console.log(res)
		task_base.value = res.data.data
		task_base.value.tags = JSON.parse(task_base.value.tags)
		console.log('task_base', task_base)
		anno_name.value = anno[task_base.value['type']]
	}
	init()

	const current_page = ref(1)
	const page_size = ref(20)
	let current_index = ref(0)
	let start_index = computed(()=>{
		return (current_page.value-1)*page_size.value
	})
	let end_index = computed(()=>{
		return current_page.value*page_size.value
	})

	// let now_index = ref(0)
	watch(current_page, ()=>{
		current_index.value = start_index.value
	})
	let change_now = function(index: number){
		current_index.value = index
	}
	let next_index = function(){
		if(current_index.value>=tasklength-1){
			return
		}
		current_index.value += 1
		if(current_index.value >= end_index.value){
			current_page.value += 1
		}
	}
	let prev_index = async function(){
		if(current_index.value<=0){
			return 
		}
		current_index.value -= 1
		if(current_index.value < start_index.value){
			current_page.value -= 1
			await nextTick()
			current_index.value = end_index.value-1
		}
	}

	let anno_change = function(data){
		anno_data.value.splice(current_index.value, 1, data)
	}

	let anno_update = async function(){
		let buff: any[] = []
		for(let index in anno_data.value){
			let data = anno_data.value[index]
			if(data.update == false){
				buff.push([index, data])
			}
		}
		let buff_data = buff.map((item)=>{
			return {
				'data':item[1].annos,
				'over_mark':item[1].overmark,
				'task_id':item[1].taskid
			}
		})
		// console.log(buff_data)
		let res = await axios.post('/anno/set', {
			'task_name':taskname,
			'anno_data':buff_data
		})
		if(res.status == 200){
			for(let data of buff){
				let index = data[0];
				data[1]['update'] = true
				anno_data.value.splice(index, 1, data[1])
			}
			ElNotification({
				'title':'提交成功',
				'message':''
			})
		}
	}
</script>

<style scoped>
	div.anno-data {
		display: flex;
		flex-direction: row;
		height: 100%;
	}

	aside.anno-aside {
		/* height: 100%; */
		overflow: auto;
		background: rgba(255,255,255,0.3);
		color: black;
		padding: 12px;
	}

	aside.anno-aside button.update {
		width: 100%;
		background-color: rgba(0,0,0,0.5);;
	}
	aside.anno-aside button.update:hover {
		background-color: var(--el-button-hover-bg-color);;
	}
	aside.anno-aside table tr:hover {
		background: rgba(255,255,255,0.5);
	}
	aside.anno-aside table th {
		font-weight: normal;
	}
	aside.anno-aside table td, aside.anno-aside table th {
		padding: 4px;
		text-align: center;
		border-bottom: 1px solid black;
	}

	div.anno-main {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
	}
	div.anno-main div.anno-core {
		flex: 1 1 0;
		overflow: auto;
	}
	div.anno-main div.anno-head svg {
		height: 1em;
	}
	div.anno-main div.anno-footer {
		display: flex;
		padding: 32px;
		justify-content: center;
		align-items: center;
	}

	div.anno-main div.anno-head {
		padding: 16px 16px 0 16px;
		background: rgba(73, 45, 91, 0.5);
	}
	div.anno-main div.anno-head ul {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 16px 0;
		margin: 0;
	}
	div.anno-main div.anno-head ul li {
		list-style: none;
		padding-right: 16px;
	}
</style>