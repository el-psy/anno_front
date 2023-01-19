<template>
	<div class="sencla">
		<div class="tags">
			<span class="title">标签: </span>
			<div>
				<el-tag class="mx-2" size="large" v-for="(value, key) in tags" :color="value.color" effeft="dark" >{{key}}</el-tag>
			</div>
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
	let tags: Ref<any> = ref({})
	let overmarks = ref(0)

	let init = async function(){
		await nextTick()
		// console.log(props.taskbase)
		// console.log(props.taskbase.tags)
		// console.log(JSON.parse(props.taskbase.tags))
		// console.log(props.taskdata[0])
		for(let tag of JSON.parse(props.taskbase.tags)){
			tags.value[tag.name] = {num:0, color:tag.color}
		}
		// console.log(tags.value)
		for(let data of props.taskdata){
			if(data['overmark'] == 1){
				overmarks.value += 1
			}
			let annos = data['annos']
			// console.log(annos)
			if(annos == ''){
				continue
			}
			tags.value[annos]['num'] += 1
		}

		// console.log(props.taskdata)

		try{
			paint()
		}catch(err){

		}
	}

	let paint = function(){

		let tag_keys = Array.from(Object.keys(tags.value))
		let nums = []; 
		for(let key of tag_keys){
			// console.log(key, tags.value[key], tags.value[key]['num'])
			nums.push(tags.value[key]['num'])
		}

		let anno_num = echarts.getInstanceByDom(document.getElementById('anno-num'))
		if(anno_num == undefined){
			anno_num = echarts.init(document.getElementById('anno-num'));
		}

		anno_num.setOption({
			title:{
				text:'标签数量'
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
	div.tags >div > * {
		margin-right: 16px;
	}
	div.tags span.title {
		display: inline-block;
		margin-bottom: 16px;
		color: black;
	}
	span.el-tag, span.el-tag i.el-tag__close {
		color: inherit;
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