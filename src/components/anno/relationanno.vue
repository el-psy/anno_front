<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span>
					关系候选对数量: {{ rel_candidate.length }}
				</span>
				<el-button class="button" text @click="overmark_change">{{ overmark_text }}</el-button>
			</div>
		</template>
		<div class="data-container">
			<div class="sen">
				<template v-for="item in render_html">
					<template v-if="item.type=='plain'">{{ item.text }}</template>
					<span v-else class="tag" :style="item.color" >{{ item.text }}</span>
				</template>
			</div>
			<div class="annos" v-if="rel_candidate.length!=0">
				<ul class="rel-index">
					<li>
						前一关系候选对: 
						<el-button type="primary" plain @click="prev_index">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
							</svg>

						</el-button>
					</li>
					<li>
						当前关系候选对: {{ now_rel_index+1 }}
					</li>
					<li>
						后一关系候选对: 
						<el-button type="primary" plain @click="next_index">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
							</svg>

						</el-button>
					</li>
				</ul>
				<div class="rel-choice">
					<div class="nodes">
						<span class="header">
							节点: 
						</span>
						<div class="node-container" v-for="item in now_rel['nodes']">
							{{ get_node_name(data['nodes'][item]) }} : 
							<el-tag class="mx-2" size="large" :color="node_color[data['nodes'][item]['type']]" effeft="dark">{{ data['nodes'][item]['type'] }}</el-tag>
						</div>
						<div class="now-rel">
							当前关系: 
							{{ get_rel(now_rel['nodes'][0], now_rel['nodes'][1])['type'] }}
						</div>
					</div>
					<div class="rels">
						<div class="left">
							<span class="header">
								关系: 
							</span>
							<template v-for="item in now_rel['rels']">
								<el-tag class="mx-2 cursor" size="large" :color="item['color']" effeft="dark" @click="rel_update(item['name'])">{{ item['name'] }}</el-tag>
							</template>
						</div>
						<div class="right">
							<el-tag class="mx-2 cursor" size="large" :color="'rgb(0,0,0)'" effeft="dark" @click="rel_delete">取消关系</el-tag>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-card>
</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, computed, ref, watch } from 'vue';
	import { ElNotification } from 'element-plus';

	let props = defineProps(['data', 'task_base'])
	let emit = defineEmits(['change'])

	let data = computed(()=>{
		let res: any = {}
		let buff = JSON.parse(props.data['annos'])
		res['relation'] = buff
		buff = JSON.parse(props.data['letters'])
		res['sen'] = buff['sen']
		res['nodes'] = buff['nodes']
		res['overmark'] = props.data['overmark']
		res['taskid'] = props.data['taskid']
		res['taskname'] = props.data['taskname']
		res['update'] = props.data['update']
		return res
	})

	let get_node_name = function(node){
		return data.value['sen'].slice(node['start'], node['end'])
	}

	let get_rel = function(index_1, index_2){
		let res = {name:''}
		for(let item in data.value['relation']){
			let rel = data.value['relation'][item]
			if(rel['node_1'] == index_1 && rel['node_2'] == index_2){
				res = rel
			}else if(rel['node_1'] == index_2 && rel['node_2'] == index_1){
				res = rel
			}
		}
		return res
	}

	let node_color = computed(()=>{
		let res: any = {}
		let item: any
		for(item of props.task_base.tags.node){
			res[item['name']] = item['color']
		}
		return res
	})

	let tag_trans = computed(()=>{
		let res: any = {}
		let item: any
		for(item of props.task_base.tags.relation){
			let node_1 = item['nodes'][0]['name']
			let node_2 = item['nodes'][1]['name']
			let rel = {name: item['name'], color: item['color']}

			if(!res[node_1]){
				res[node_1] = {}
			}

			if(res[node_1][node_2]){
				res[node_1][node_2].push(rel)
			}else{
				res[node_1][node_2] = [rel]
			}
			if(node_1 == node_2){
				continue
			}

			if(!res[node_2]){
				res[node_2] = {}
			}

			if(res[node_2][node_1]){
				res[node_2][node_1].push(rel)
			}else{
				res[node_2][node_1] = [rel]
			}
		}

		return res
	})

	let rel_candidate = computed(()=>{
		let res: any = []
		let node_len = data.value.nodes.length
		for(let index_1 =0; index_1<node_len-1; index_1++){
			for(let index_2 = index_1+1; index_2<node_len; index_2++){
				let type_1 = data.value.nodes[index_1]['type']
				let type_2 = data.value.nodes[index_2]['type']
				if(tag_trans.value[type_1]){
					if(tag_trans.value[type_1][type_2]){
						res.push({
							'nodes':[index_1, index_2],
							'rels': tag_trans.value[type_1][type_2]
						})
					}
				}
			}
		}

		return res
	})

	let now_rel_index = ref(0)
	let prev_index = function(){
		if(now_rel_index.value<=0){
			return 
		}
		now_rel_index.value -= 1
	}
	let next_index = function(){
		if(now_rel_index.value>=rel_candidate.value.length-1){
			return
		}
		now_rel_index.value += 1
	}
	watch(()=>props.data, ()=>{
		now_rel_index.value = 0
	})
	let now_rel = computed(()=>{
		if(rel_candidate.value.length == 0){
			return {
				'nodes':[],
				'rels':[]
			}
		}
		return rel_candidate.value[now_rel_index.value]
	})

	let render_html = computed(()=>{
		let buff: any = (Array.from(data.value.sen)).map((item: any, index: any, arr: any)=>{
			return {
				'letter': item,
				's_or_e': 'plain',
				'color': '',
				'index':''
			}
		})

		let annos = []
		if(rel_candidate.value.length > 0){
			annos = rel_candidate.value[now_rel_index.value]['nodes'].map((item)=>{
				return data.value.nodes[item]
			})
		}

		for(let tag_index in annos){
			let tag = annos[tag_index]
			buff[tag.start]['s_or_e'] = 'start'; buff[tag.end-1]['s_or_e'] = 'end'
			buff[tag.start]['index'] = tag_index

			for(let index = parseInt(tag.start); index<parseInt(tag.end); index+=1){

				if(buff[index]['color']!=''){
					ElNotification({
						'title':'标签问题',
						'message':'标签索引重叠'
					})
					return 
				}
				buff[index]['color'] = node_color.value[tag['type']]
			}
		}
		let res = []
		let node = {'type':'plain', 'color':'', 'click':'', 'text':''}
		for(let letter of buff){
			if(letter.s_or_e == 'start'){
				res.push(node)
				node = {'type':'span', 'color':`color:${letter.color}`, 'click':letter.index, 'text':letter.letter}
			}else if(letter.s_or_e == 'end'){
				node.text += letter.letter
				res.push(node)
				node = {'type':'plain', 'color':'', 'click':'', 'text':''}
			}else {
				node.text += letter.letter
			}
		}
		if(node.text!=''){
			res.push(node)
		}

		return res
	})

	let overmark_change = function(){
		let buff_data = props.data
		if(buff_data['overmark']==0){
			buff_data['overmark'] = 1
		}else{
			buff_data['overmark'] = 0
		}
		buff_data['update'] = false
		emit('change', buff_data)
	}
	let overmark_text = computed(()=>{
		if(props.data.overmark == '0'){
			return '未确认'
		}
		return '已确认'
	})

	let anno_change = function(annos: any){
		let buff_data = props.data
		buff_data['annos'] = JSON.stringify(annos)
		buff_data['update'] = false
		emit('change', buff_data)
	}
	let get_all_rel = function(){
		let res = []
		let item: any
		for(item of rel_candidate.value){
			let rel = get_rel(item['nodes'][0], item['nodes'][1])
			res.push({
				node_1:item['nodes'][0],
				node_2:item['nodes'][1],
				type:rel['type']
			})
		}
		return res
	}
	let rel_update = function(rel_name){
		let all_rel = get_all_rel()
		all_rel[now_rel_index.value]['type'] = rel_name
		anno_change(all_rel.filter((item)=> item['type']!=''))
	}
	let rel_delete = function(){
		let all_rel = get_all_rel()
		all_rel[now_rel_index.value]['type'] = ''
		anno_change(all_rel.filter((item)=> item['type']!=''))
	}
</script>

<style scoped>
	.box-card {
		margin: 16px;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	div.sen {
		margin-bottom: 16px;
	}

	div.annos ul.rel-index {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 16px 0;
		margin: 0;
	}
	div.annos ul.rel-index li {
		list-style: none;
		padding-right: 16px;
	}
	div.annos ul.rel-index svg {
		height: 1em;
	}

	span.el-tag, span.el-tag i.el-tag__close {
		color: white;
	}
	span.el-tag.cursor {
		cursor: pointer;
	}
	div.rel-choice div.nodes {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
	}
	div.rel-choice div.nodes div.node-container {
		margin-right: 16px;
	}
	div.rel-choice div.nodes div.now-rel {
		flex: 1;
		text-align: right;
	}
	div.rel-choice span.header {
		margin-right: 16px;
	}
	div.rels {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	div.rels div.left>* {
		margin-right: 16px;
	}
</style>