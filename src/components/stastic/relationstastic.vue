<template>
	<div class="rel">
		<div class="tags">
			<span class="title">标签: </span>
			<div class="nodes">
				<span class="header">节点: </span>
				<el-tag class="mx-2" size="large" v-for="item in nodes" :color="item.color" effeft="dark" >{{item.name}}</el-tag>
			</div>
			<span class="header">关系: </span>
			<table class="relation-table">
				<thead>
					<tr>
						<td>节点1</td>
						<td>节点2</td>
						<td>关系名</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in relations" key="item.relation.name">
						<td>
							<el-tag class="mx-2" size="large" :color="item.nodes[0].color" effeft="dark">{{item.nodes[0].name}}</el-tag>
						</td>
						<td>
							<el-tag class="mx-2" size="large" :color="item.nodes[1].color" effeft="dark">{{item.nodes[1].name}}</el-tag>
						</td>
						<td>
							<el-tag class="mx-2" size="large" :color="item.color" effeft="dark" >{{item.name}}</el-tag>
						</td>
					</tr>
				</tbody>
			</table>

		</div>
		<div class="stastic">
			<div id="anno-num"></div>
			<div id="anno-overmark"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { defineProps, ref, Ref, nextTick, watch, onMounted } from 'vue';
	import * as echarts from 'echarts';
	
	let props = defineProps(['taskdata', 'taskbase'])
	let nodes: Ref<any[]> = ref([])
	let relations: Ref<any[]> = ref([])
	let relation_num: Ref<any> = ref({})
	let overmarks = ref(0)

	let init = async function(){
		await nextTick()
		// console.log(props.taskbase)
		// console.log(props.taskbase.tags)
		console.log(JSON.parse(props.taskbase.tags))
		let buff = JSON.parse(props.taskbase.tags)
		nodes.value = buff['node']
		relations.value = buff['relation']
		// console.log(props.taskdata[0])
		// for(let tag of JSON.parse(props.taskbase.tags)){
		// 	tags.value[tag.name] = {num:0, color:tag.color}
		// }
		// console.log(tags.value)
		for(let index in relations.value){
			let item = relations.value[index]
			console.log('item', item)
			relation_num.value[item['name']] = 0
		}
		for(let data of props.taskdata){
			if(data['overmark'] == 1){
				overmarks.value += 1
			}
			let annos = data['annos']
			if(annos == ''){
				continue
			}
			annos = JSON.parse(annos)
			for(let index in annos){
				let item = annos[index]
				relation_num.value[item['type']] += 1
			}
			
		}

		// console.log(props.taskdata)

		try{
			paint()
		}catch(err){

		}
	}

	let paint = function(){
		let tag_keys = Array.from(Object.keys(relation_num.value))
		let nums = []; 
		for(let key of tag_keys){
			// console.log(key, relation_num.value[key], relation_num.value[key])
			nums.push(relation_num.value[key])
		}

		let anno_num = echarts.getInstanceByDom(document.getElementById('anno-num'))
		if(anno_num == undefined){
			anno_num = echarts.init(document.getElementById('anno-num'));
		}

		anno_num.setOption({
			title:{
				text:'关系数量'
			},
			tooltip:{},
			xAxis:{
				data: tag_keys
			},
			yAxis:{},
			series:[
				{
					name:'数量',
					type:'bar',
					data:nums
				}
			]
		})


		let anno_overmark = echarts.getInstanceByDom(document.getElementById('anno-overmark'))
		if(anno_overmark == undefined){
			anno_overmark = echarts.init(document.getElementById('anno-overmark'));
		}
		anno_overmark.setOption({
			title: {
				text: '已确认-未确认',
				left: 'center',
				top: 'center'
			},
			series: [
				{
				type: 'pie',
				data: [
					{
						value: overmarks.value,
						name:`已确认: ${overmarks.value}`
					},
					{
						value: props.taskdata.length - overmarks.value,
						name:`未确认: ${props.taskdata.length - overmarks.value}`
					}
				],
				radius: ['40%', '70%']
				}
			]
		})
	}

	watch(
		()=> [props.taskbase, props.taskdata],
		()=>{
		init()
	})
</script>

<style scoped>
	div.tags {
		padding: 16px;
		border-radius: 16px;
		background-color: white;
		margin-bottom: 16px;
	}
	div.tags div.nodes {
		margin-bottom: 16px;
	}
	div.tags >div > * {
		margin-right: 16px;
	}
	div.tags span.title {
		display: inline-block;
		margin-bottom: 16px;
		color: black;
	}

	div.tags span.header {
		display: inline-block;
		color: black;
	}
	span.el-tag, span.el-tag i.el-tag__close {
		color: inherit;
	}

	table.relation-table td {
		/* border-top: 1px solid black; */
		border-bottom: 1px solid black;
		text-align: center;
		padding: 12px;
	}

	table.relation-table thead {
		color: black;
	}

	table.relation-table {
		width: max-content;
		border-collapse: separate;
		width: 100%;
		/* padding-top: 16px; */
	}

	div.stastic {
		padding: 16px;
		border-radius: 16px;
		background-color: white;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	div.stastic div#anno-num {
		width: 400px;
		height: 400px;
	}
	div.stastic div#anno-overmark {
		width: 400px;
		height: 400px;
	}
</style>