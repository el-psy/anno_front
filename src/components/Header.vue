<template>
	<header>
		<div class="header-left">
			<RouterLink to="/">
				<span class="username">{{store.username}}</span>
			</RouterLink>
			<span class="userrole">用户类型: {{store.actor}}</span>
			<template v-if="getRole()=='plain'">
				<RouterLink to="/anno/task" class="button">标注任务</RouterLink>
				<RouterLink :to="'/anno/data/'+store.taskname" class="button">标注</RouterLink>
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
		margin-right: 16px;
	}
	span.userrole {
		margin-right: 16px;
	}
	header div.header-left a.button {
		height: 100%;
		padding: 16px;
		color: #f56c6c;
	}
	header div.header-left a.button:hover {
		background-color: rgba(90, 114, 189, 0.5);
    	backdrop-filter: blur(2px);
		color: #f56c6c;
	}
	button {
		background: transparent;
	}
</style>