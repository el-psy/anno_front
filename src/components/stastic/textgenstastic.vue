<template>
	<div class="textgen">
		<div class="stastic">
			<div id="anno-overmark"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { defineProps, ref, Ref, nextTick, watch, onMounted } from 'vue';
	import * as echarts from 'echarts';
	
	let props = defineProps(['taskdata', 'taskbase'])
	let overmarks = ref(0)

	let init = async function(){
		await nextTick()
		// console.log(props.taskbase)
		// console.log(props.taskbase.tags)
		// console.log(JSON.parse(props.taskbase.tags))
		// console.log(props.taskdata[0])
		// console.log(tags.value)
		for(let data of props.taskdata){
			if(data['overmark'] == 1){
				overmarks.value += 1
			}
		}

		try{
			paint()
		}catch(err){

		}
	}

	let paint = function(){

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
		

	div.stastic {
		padding: 16px;
		border-radius: 16px;
		background-color: white;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	div.stastic div#anno-overmark {
		width: 400px;
		height: 400px;
	}
</style>