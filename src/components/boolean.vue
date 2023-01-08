<template>
	<span :class="span_class">
		<svg v-if="!props.bool" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['w-6', 'h-6','false']">
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>

		<svg v-if="props.bool" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="['w-6', 'h-6', 'true']">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	</span>

</template>

<script lang="ts" setup>
	import { defineProps, computed } from 'vue';
	let props = defineProps(['bool'])
	let span_class = computed(()=>{
		if(props.bool){
			return 'true'
		}else{
			return 'false'
		}
	})
</script>

<style scoped>
	svg.true {
		background-color: #10B981;
	}
	svg.false {
		background-color: #EF4444;
	}
	span svg {
		height: 1em;
	}
</style>