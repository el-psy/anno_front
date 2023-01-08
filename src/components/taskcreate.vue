<template>
	<div class="task-create">
		<div class="create-item">
			<span class="head">任务名称: </span>
			<el-input v-model="task_name" placeholder="任务名称" clearable />
		</div>
		<div class="create-item">
			<span class="head">任务类型: </span>
			<el-select v-model="task_type" class="m-2" placeholder="Select" size="large">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
					/>
			</el-select>
			<el-tag class="mx-1" size="large" :type="need_tag=='无需标签'?'success':'danger'" plain>{{need_tag}}</el-tag>
		</div>

		<TagInput @tag_change="tag_change" :task_type="task_type"></TagInput>
		<div class="create-item">
			<span class="head">提交标注数据文件: </span>
			<FileInput @change="file_change" :task_type="task_type">file</FileInput>
		</div>
		<div class="file">
			<pre>文件格式：
{{ structure_text }}</pre>
			<el-button type="primary" plain  @click="file_val">标注数据格式认证</el-button>
			<el-tag class="mx-1" size="large" :type="file_mark?'success':'danger'" plain>{{ file_mark }}</el-tag>
		</div>
		<div style="padding: 16px;">
			<el-button type="primary" plain  @click="task_create">创建任务</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
	// name
	// type
	// needtag
	// status
	// tags
	import { ref, reactive, computed, Ref, watch, inject } from 'vue'
	import { ElNotification } from 'element-plus';
	import FileInput from './fileinput.vue'
	import TagInput from './taginput.vue'
	import { file_validation } from './file';

	const task_name = ref('')
	const task_type = ref('node')
	const options = [
		{
			value: 'node',
			label: '节点',
		},
		{
			value: 'relation',
			label: '关系',
		},
		{
			value: 'sentence_classifier',
			label: '句子分类',
		},
		{
			value: 'text_generation',
			label: '文本生成',
		}
	]
	const need_tag_map : any = reactive({
		'node':'需要标签',
		'relation':'需要标签',
		'sentence_classifier':'需要标签',
		'text_generation':'无需标签'
	})

	let need_tag = computed(()=>{
		return need_tag_map[task_type.value]
	})

	let tags: Ref<any> = ref([])
	let tags_buff: Ref<any> = ref({node:[], relation:[]})
	let tag_change = function(new_tags: any){
		// console.log('tags_change', new_tags);
		tags_buff.value = new_tags
		if(task_type.value == 'node' || task_type.value == 'sentence_classifier'){
			tags.value = tags_buff.value['node'] || []
		}else if(task_type.value == 'relation'){
			tags.value = tags_buff.value
		}else if(task_type.value == 'text_generation'){
			tags.value = []
		}
		// console.log('tags', tags.value)

		file_mark.value = false
	}
	watch(task_type, ()=>{
		if(task_type.value == 'node' || task_type.value == 'sentence_classifier'){
			tags.value = tags_buff.value['node'] || []
		}else if(task_type.value == 'relation'){
			tags.value = tags_buff.value
		}else if(task_type.value == 'text_generation'){
			tags.value = []
		}
		console.log('tags', tags.value)

		structure_text.value = file_validation[task_type.value].structure

		file_mark.value = false
	})

	let task_data = ref([])
	let file_change = function(text: any){
		// console.log('file_change')
		// console.log(text)
		task_data.value = text

		file_mark.value = false
	}


	let structure_text = ref(file_validation[task_type.value].structure)
	let file_mark = ref(false)
	let file_val = function(){
		if(task_data.value.length == 0){
			ElNotification({
				title:'标注数据格式认证失败',
				message: '数据为空'
			})
			return
		}
		file_mark.value=file_validation[task_type.value].validation(task_data.value, tags.value)
	}

	let axios:any = inject('axios');
	let task_create = async function(){
		if(task_name.value == ''){
			ElNotification({
				title:'创建任务失败',
				message: '任务名为空'
			})
			return
		}
		if(file_mark.value == false){
			ElNotification({
				title:'创建任务失败',
				message: '文件数据格式未进行或失败'
			})
			return
		}
		ElNotification({
			title:'创建任务中',
			message: '创建任务数据提交中'
		})
		let res = await axios.post('/task/create',{
			task_name:task_name.value,
			task_type:task_type.value,
			need_tag: (need_tag.value == '需要标签'?1:0),
			task_tags:JSON.stringify(tags.value),
			task_data: file_validation[task_type.value].deal(task_data.value)
		})
		console.log(res);

		if(res.data.message == 'OK' && res.status == 200){
			ElNotification({
				title:'创建任务成功',
				message: '任务 '+ task_name.value + ' 创建完成'
			})
		}
	}
</script>

<style >
	div.task-create {
		padding: 16px;
	}
	div.create-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 16px;
	}


	div.create-item>span.head {
		min-width: max-content;
		padding: 8px 16px 8px 0;
	}

	div.create-item>* {
		padding-right: 16px;
	}

	div.create-item>.el-card {
		flex: 1 1 0;
	}

	div.create-item div.el-input {
		flex: 1 1 0;
		height: 38px;
	}

	div.create-item span.el-tag {
		font-size: 14px;
		height: 40px;
		background-color: none;
	}

	div.file {
		padding: 16px;
		background: #eee;
		border-radius: 12px;
		color: black;

		display: flex;
		flex-direction: row;
	}

	div.file>* {
		margin-right: 16px;
	}
</style>