<template>
	<div>
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span v-for="item in render_tags">
						{{ item.key }} : 
						<span class="tag" :style="`color: ${item.color}`">{{ item.name }}</span>
					</span>
					<el-button class="button" text @click="overmark_change">{{ overmark_text }}</el-button>
					
				</div>
			</template>
			<div id="render" ref="render">
				<template v-for="item in render_html">
					<template v-if="item.type=='plain'">{{ item.text }}</template>
					<span v-else class="tag" :style="item.color" @dblclick="del_tag(item.click)">{{ item.text }}</span>
				</template>
			</div>
		</el-card>
	</div>

</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, computed, ref, onMounted, onUnmounted } from 'vue';
	import { ElNotification } from 'element-plus';

	let props = defineProps(['data', 'task_base'])
	// let {data, task_base} = props
	let emit = defineEmits(['change'])

	let tag_color: any = {}
	for(let tag of props.task_base.tags){
		tag_color[tag['name']] = tag['color']
	}
	let tag_key: any = Array.from('1234567890qwertyuiopasdfghjklzxcvbnm')
	let key_tag: any = {}
	for(let index in props.task_base.tags){
		// index = parseInt(index)
		key_tag[tag_key[index]] = props.task_base.tags[index]['name']
	}

	let render_tags = computed(()=>{
		let res: any[] = []
		for(let key in key_tag){
			let buff = {key: key, name: key_tag[key], color: tag_color[key_tag[key]]}
			res.push(buff)
		}
		return res
	})

	let anno_change = function(annos: any){
		let buff_data = props.data
		buff_data['annos'] = JSON.stringify(annos)
		buff_data['update'] = false
		emit('change', buff_data)
	}
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

	let render_html = computed(()=>{
		let buff: any = (Array.from(props.data.letters)).map((item: any, index: any, arr: any)=>{
			return {
				'letter': item,
				's_or_e': 'plain',
				'color': '',
				'index':''
			}
		})
		// console.log(buff)
		// console.log(props.data.annos)
		// console.log(JSON.parse(props.data.annos))
		let annos = JSON.parse(props.data.annos)
		// console.log(annos)
		for(let tag_index in annos){
			let tag = annos[tag_index]
			buff[tag.start]['s_or_e'] = 'start'; buff[tag.end-1]['s_or_e'] = 'end'
			buff[tag.start]['index'] = tag_index
			// console.log(tag)
			for(let index = parseInt(tag.start); index<parseInt(tag.end); index+=1){
				// console.log(index)
				if(buff[index]['color']!=''){
					ElNotification({
						'title':'标签问题',
						'message':'标签索引重叠'
					})
					return 
				}
				buff[index]['color'] = tag_color[tag['type']]
			}
		}
		let res = []
		let node = {'type':'plain', 'color':'', 'click':'', 'text':''}
		for(let letter of buff){
			if(letter.s_or_e == 'start'){
				res.push(node)
				node = {'type':'span', 'color':`color:${letter.color}`, 'click':letter.index, 'text':letter.letter}
				// node.type = 'span'; node.color = letter.color; node.click = letter.index
				// node = `<span class="tag" style="color: ${letter.color}" onclick="del_try">${letter.letter}`
				// node.text += letter.letter
			}else if(letter.s_or_e == 'end'){
				// node = node + `${letter.letter}</span>`
				node.text += letter.letter
				res.push(node)
				node = {'type':'plain', 'color':'', 'click':'', 'text':''}
			}else {
				// node = node + letter.letter
				node.text += letter.letter
			}
		}
		if(node.text!=''){
			res.push(node)
		}
		// console.log(res)
		// console.log(buff)
		return res
	})

	let render = ref(null)
	let nodes: any[] = []
	
	let keydown = function(event){
		

		
		let selection = window.getSelection()
		try{
			nodes = Array.from(render.value.childNodes)
		}catch{
			// console.log('error')
		}
			
		// console.log(event)
		// console.log(render.value)
		// console.log(nodes)
		// console.log(selection)
		// console.log(nodes.includes(selection.anchorNode), nodes.findIndex((item)=>{
		// 	return item == selection.anchorNode
		// }), selection.anchorNode == selection.focusNode)

		let find_index = nodes.findIndex((item)=>{
			return item == selection?.anchorNode
		})
		// console.log(find_index)
		if(find_index!=-1 && selection.anchorNode == selection.focusNode && selection?.anchorOffset!=selection?.focusOffset && key_tag[event.key]){
			// console.log('selection!!!')
			let start_index = 0; let end_index = 0
			for(let index =0; index<find_index; index++){
				start_index += nodes[index].textContent.length
			}
			start_index += selection?.anchorOffset; end_index = start_index + selection?.focusOffset - selection?.anchorOffset
			// console.log(start_index, end_index)
			// console.log(props.data.letters.slice(start_index, end_index))
			let select_text = props.data.letters.slice(start_index, end_index)
			if(select_text[0]==' ' || select_text[select_text.length-1]==' '){
				ElNotification({
					'title':'标签添加失败',
					'message':'选中部分首尾存在空格'
				})
				return 
			}else {
				let annos = JSON.parse(props.data.annos)
				annos.push({
					'type':key_tag[event.key],
					'start':start_index,
					'end':end_index
				})
				anno_change(annos)
			}
		}
	}
	onMounted(()=>{
		// console.log(render.value)
		// render.value.addEventListener('keydown', keydown)
		// nodes = Array.from(render.value.childNodes)
		window.addEventListener('keydown', keydown)
	})
	onUnmounted(()=>{
		// render.value.removeEventListener('keydown', keydown)
		window.addEventListener('keydown', keydown)
	})

	let del_tag = function(index){
		window.getSelection().empty()
		let anno_data = JSON.parse(props.data.annos)
		anno_data.splice(index, 1)
		let buff_data = props.data
		buff_data.annos = JSON.stringify(anno_data)
		buff_data['update'] = false
		emit('change', buff_data)
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
</style>