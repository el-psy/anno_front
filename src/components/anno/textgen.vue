<template>
	<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>
						标注结果字数: {{ props.data.annos.length }}
					</span>
					<el-button class="button" text @click="overmark_change">{{ overmark_text }}</el-button>
					
				</div>
			</template>
			<div class="data-container">
				<div class="sen">
					{{ props.data.letters }}
				</div>
				<div class="annos">
					<textarea v-model="tag"></textarea>
				</div>
			</div>
		</el-card>
</template>

<script lang="ts" setup>
	import { defineProps, defineEmits, computed, ref, watch } from 'vue';
	import { ElNotification } from 'element-plus';

	let props = defineProps(['data', 'task_base'])
	let emit = defineEmits(['change'])



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
		// let buff = 
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

	div.sen {
		margin-bottom: 16px;
	}

	div.annos textarea {
		width: 100%;
		height: 6em;
		font-size: 16px;
	}
</style>