<template>
	<el-button type="primary" plain  @click="button_click">
		<slot></slot>
	</el-button>
</template>

<script lang="ts" setup>
	import {ref, reactive, defineEmits, defineProps, watch, computed} from 'vue';
	// import file_validatoin from './file_validation';

	let emit = defineEmits(['change']);
	let props = defineProps(['task_type'])

	// let text = ''
	let input_element = document.createElement('input')
	input_element.type = 'file'

	input_element.onchange = async function(e : any){
		if(e.target.value != ''){
			let target = e.target
			let text = await e.target.files[0].text()
			target.value = ''
			emit('change', JSON.parse(text))
		}
	}
	let button_click = function(){
		input_element.click()
	}

	// let structure_text = ref(file_validatoin[props.task_type].structure)
	// watch(props.task_type, (new_value, old_value)=>{
	// 	structure_text.value = file_validatoin[props.task_type].structure
	// })
	// let structure_text = computed(()=>{
	// 	return file_validatoin[props.task_type].structure
	// })
</script>

<style>

</style>