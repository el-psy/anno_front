<template>
	<div class="box-card" v-show="all_show">
		<div class="card-header">
			<span class="head">标签名称: </span>
			<el-input v-model.trim="node_tag_name" placeholder="标签名称" clearable />
			<span class="head">颜色选择: </span>
			<el-color-picker v-model="node_tag_color" show-alpha :predefine="predefineColors" />
			<el-button type="primary" plain @click="add_tag">添加标签</el-button>
		</div>
		<div class="card-body">
			<el-tag class="mx-2" size="large" v-for="item in node_tags" :color="item.color" effeft="dark" closable @close.stop="del_tag(item)" @click="relation_nodes_add(item)">{{item.name}}</el-tag>
		</div>
		<div class="card-header" v-show="relation_show">
			<span class="head">标签名称: </span>
			<el-input v-model.trim="relation_name" placeholder="标签名称" clearable />
			<span class="head">颜色选择: </span>
			<el-color-picker v-model="relation_color" show-alpha :predefine="predefineColors" />
			<el-button type="primary" plain @click="relation_add">添加标签</el-button>
		</div>
		<div class="card-body" v-show="relation_show">
			<el-tag class="mx-2" size="large" v-for="item in relation_nodes" :color="item.color" effeft="dark">{{item.name}}</el-tag>
		</div>
		<table class="relation-table" v-show="relation_show">
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
						<el-tag class="mx-2" size="large" :color="item.color" effeft="dark" closable @close="relation_del(item.name)">{{item.name}}</el-tag>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
	import { ref, Ref, defineEmits, defineProps, watch, computed } from 'vue'
	import { ElNotification } from 'element-plus';

	let tags: Ref<any> = ref({node:[], relation:[]})
	let emit = defineEmits(['tag_change'])
	let props = defineProps(['task_type'])
	let all_show = computed(()=>{
		if(props.task_type == 'text_generation'){
			return false
		}
		return true
	})
	let relation_show = computed(()=>{
		if(props.task_type == 'relation'){
			return true
		}
		return false
	})

	let node_tags: Ref<any[]> = ref([])
	const node_tag_name = ref('')
	const node_tag_color = ref('#3B82F6')
	const predefineColors = ref([
		'#3B82F6',
		'#8B5CF6',
		'#EF4444',
		'#F97316',
		'#F59E0B',
		'#EAB308',
		'#84CC16',
		'#22C55E',
		'#10B981',
		'#14B8A6',
		'#06B6D4',
		'#0EA5E9',
		'#6366F1',
		'#A855F7',
		'#D946EF',
		'#EC4899',
		'#F43F5E'
	])
	let add_tag = function(){
		if(node_tag_name.value == ''){
			ElNotification({
				title:'添加标签失败',
				message: '标签名为空'
			})
			return
		}
		for(let item of node_tags.value){
			if(item.color == node_tag_color.value){
				ElNotification({
					title:'添加标签失败',
					message: '颜色重复'
				})
				return
			}
			if(item.name == node_tag_name.value){
				ElNotification({
					title:'添加标签失败',
					message: '标签名重复'
				})
				return
			}
		}
		node_tags.value.push({'name':node_tag_name.value, 'color':node_tag_color.value})
	}
	let del_tag = function(node: any){
		node_tags.value = node_tags.value.filter((value, index, arr)=>{
			return value.name != node.name
		})
		relation_nodes.value = relation_nodes.value.filter((value, index, arr)=>{
			return value.name != node.name
		})
		relations.value = relations.value.filter((value)=>{
			return value.nodes[0].name!=node.name && value.nodes[1].name!=node.name
		})
	}
	watch(node_tags, async ()=>{
		tags.value.node = node_tags.value
		// console.log(new_node_tags)
		// console.log('value', node_tags.value)
		// console.log('tags', tags.value)
		emit('tag_change', tags.value)
	}, { deep: true })

	let relations: Ref<any[]> = ref([])
	let relation_nodes: Ref<any[]> = ref([])
	let relation_name = ref('')
	let relation_color = ref('#3B82F6')
	let relation_nodes_add = function(node: any){
		// for(let item of relation_nodes.value){
		// 	if(item.name == node.name){
		// 		ElNotification({
		// 			title:'添加标签失败',
		// 			message: '标签重复'
		// 		})
		// 		return
		// 	}
		// }
		if(relation_nodes.value.length<2){
			relation_nodes.value.push(node)
		}else {
			relation_nodes.value[0] = relation_nodes.value[1]
			relation_nodes.value[1] = node
		}
	}
	let relation_add = function(){
		if(relation_name.value == ''){
			ElNotification({
				title:'添加关系标签失败',
				message: '关系名为空'
			})
			return
		}
		if(relation_nodes.value.length <2){
			ElNotification({
				title:'添加关系标签失败',
				message: '关系节点数量错误'
			})
			return
		}
		for(let item of relations.value){
			if(relation_name.value == item.name){
				ElNotification({
					title:'添加关系标签失败',
					message: '关系标签名重复'
				})
				return
			}
			if(relation_color.value == item.color){
				ElNotification({
					title:'添加关系标签失败',
					message: '关系颜色重复'
				})
				return
			}
		}
		relations.value.push({
			nodes: [...relation_nodes.value],
			name: relation_name.value,
			color: relation_color.value
		})
		relation_nodes.value.splice(0, 2)
		relation_name.value = ''
	}
	let relation_del = function(rel_name: any){
		relations.value = relations.value.filter((value)=>{
			return value.name != rel_name
		})
	}
	watch(relations, async()=>{
		tags.value.relation = relations.value
		// console.log('tags', tags.value)
		emit('tag_change', tags.value)
	}, { deep: true })

</script>

<style scoped>

	div.box-card {
		padding: 0 16px;
		background: white;
		border-radius: 12px;
		overflow: hidden;
		padding-bottom: 16px;
		margin-bottom: 16px;
	}

	div.card-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px 0;
	}

	div.card-header span.head {
		white-space: nowrap;
		color: black;
	}

	div.card-body {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 12px;
		min-height: 32px;
		border: 1px solid #333;
		border-radius: 12px;
	}

	span.el-tag, span.el-tag i.el-tag__close {
		color: inherit;
	}

	div.card-header>*, div.card-header div.el-color-picker {
		padding-right: 12px !important;
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
		padding-top: 16px;
	}
</style>