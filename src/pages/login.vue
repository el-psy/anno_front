<template>
	<div class="login">
		<el-card class="box-card">
			<el-input class="text item" v-model="name" placeholder="用户名" clearable />
			<el-input class="text item" v-model="password" type="password" placeholder="密码" show-password/>

			<el-row class="button-container text item">
				<el-button type="danger" plain @click="login">登录</el-button>
				<el-button type="danger" plain @click="register">注册</el-button>
			</el-row>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
	import {reactive, ref, inject, h} from 'vue';
	import { ElNotification } from 'element-plus';
	import { setToken, setRole } from '../utils';
	import { useRouter, useRoute } from 'vue-router';
	import {useStore} from '../stores/index';

	let name = ref('')
	let password = ref('')
	let axios:any = inject('axios');
	let router = useRouter()
	let store = useStore()

	let login = async function(){
		let res = await axios.post('/auth/login', {
			user_name:name.value,
			password:password.value
		})
		//.catch((error)=>{
		// 	if(error.response){
		// 		ElNotification({
		// 			title: '登录失败',
		// 			message: error.response.data.message.toString(),
		// 		})
		// 	}else {
		// 		ElNotification({
		// 			title: '登录失败',
		// 			message: error.toJSON().message,
		// 		})
		// 	}
		// })
		setRole(res.data['actor'])
		setToken(res.data['set-token'])
		store.$patch({
			actor:res.data['actor'],
			username:name.value
		})
		console.log('res', res);
		router.push('/')
	}

	let register = async function(){
		let res = await axios.post('/auth/register', {
			user_name:name.value,
			password:password.value
		})
		// .catch((error)=>{
		// 	if(error.response){
		// 		ElNotification({
		// 			title: '注册失败',
		// 			message: error.response.data.message.toString(),
		// 		})
		// 	}else {
		// 		ElNotification({
		// 			title: '注册失败',
		// 			message: error.toJSON().message,
		// 		})
		// 	}
		// })
		console.log(res)
		if(res.data == 'OK' && res.status == 200){
			ElNotification({
				title: '注册成功',
				message: res.data,
			})
		}
	}
</script>

<style scoped>
	div.login {
		width: 100vw;
		height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;

		background: url('../assets/login_background.jpg') no-repeat center/cover ;

		
	}

	.button-container button{
		backdrop-filter: opacity(100%);
		background: none;
		flex-grow: 1;
	}

	.text {
		font-size: 14px;
	}

	.item {
		padding: 18px 0;
	}

	.box-card {
		width: 480px;
		border-radius: 16px;
		background-color: rgba(90, 114, 189, 0.5);
		backdrop-filter: blur(2px);
	}
</style>