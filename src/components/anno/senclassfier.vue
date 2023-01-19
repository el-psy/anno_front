<template>
	<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>
						句子类型: 
						<el-tag class="mx-2" size="large" :color="tag_color[props.data.annos]" effect="dark">{{ props.data.annos }}</el-tag>
					</span>

					<el-button class="button" text @click="overmark_change">{{ overmark_text }}</el-button>
					
				</div>
			</template>
			<div class="data-container">
				<div class="sen">
					{{ props.data.letters }}
				</div>
				<form class="choice">
					<div class="tag-item" v-for="item in props.task_base.tags">
						<input type="radio" :id="item.name" name="tag" :value="item.name" v-model="tag"/>
						<label :for="item.name">
							<el-tag class="mx-2" size="large" :color="item.color" effect="dark">{{ item.name }}</el-tag>
						</label>
					</div>
				</form>
			</div>
		</el-card>
</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, computed, ref, watch } from 'vue';
	import { ElNotification } from 'element-plus';

	let props = defineProps(['data', 'task_base'])
	let emit = defineEmits(['change'])

	let tag_color: any = {}
	for(let tag of props.task_base.tags){
		tag_color[tag['name']] = tag['color']
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

	let anno_change = function(annos: any){
		let buff_data = props.data
		buff_data['annos'] = annos
		buff_data['update'] = false
		emit('change', buff_data)
	}

	let tag = ref(props.data.annos)
	watch(()=> props.data.annos, ()=>{
		tag.value = props.data.annos
	})
	watch(tag, (new_value, old_value)=>{
		if(new_value != props.data.annos){
			anno_change(new_value)
		}
		
	})
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

	form.choice {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	form.choice div.tag-item {
		margin: 16px;
	}

	.choice input {
		appearance: none;

		border-radius: 50%;
		width: 16px;
		height: 16px;

		border: 2px solid #999;
		transition: 0.2s all linear;
		margin-right: 5px;

		position: relative;
		top: 4px;
	}

	.choice input:checked {
		border: 6px solid black;
	}
</style>