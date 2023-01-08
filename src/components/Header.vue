<template>
	<header>
		<div>
			<RouterLink to="/">
				<span class="username">{{store.username}}</span>
			</RouterLink>
			<span class="userrole">{{store.actor}}</span>
			<template v-if="getRole()=='plain'">
				<RouterLink to="/anno/task">标注任务</RouterLink>
				<RouterLink :to="'/anno/data/'+store.taskname">标注</RouterLink>
			</template>
		</div>
		<el-button type="danger" plain @click="logout">Logout</el-button>
	</header>
</template>

<script lang="ts" setup>
	import { useStore } from '../stores';
	import { RouterLink, useRouter } from 'vue-router';
	import { delToken, getRole } from '../utils';
	// import { useStore } from '../stores';
	import {ref} from 'vue'
	
	let store = useStore()
	let router = useRouter()

	let logout = function(){
		store.$patch({
			actor:'',
			username:''
		})
		delToken()
		router.push('/')
	}
</script>

<style scoped>
	header {
		background-color: rgba(90, 114, 189, 0.5);
		backdrop-filter: blur(2px);
		display: flex;
		justify-content: space-between;
		padding: 8px;
		height: 32px;
	}

	span {
		padding-left: 4px;
	}
	span.username {
		font-size: 24px;
	}

	button {
		background: transparent;
	}
</style>