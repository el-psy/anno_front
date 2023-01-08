import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

import './css/index.css'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import router from './router'
import {createPinia} from 'pinia';
import piniaPersist from 'pinia-plugin-persist'

import { getToken } from './utils'

import { ElNotification } from 'element-plus';

const pinia = createPinia()
pinia.use(piniaPersist)

axios.defaults.baseURL = 'http://localhost:5000'

axios.interceptors.request.use(function (config: any) {
    // 在发送请求之前做些什么
	if(getToken()){
		config.headers['Authorization'] = 'Bearer '+getToken();
	}
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
	let message = ''
	if(error.response){
		error = error.response
		message = error.data['message'] || error.data || message
	}else {
		error.status = ''
		message = error.message || message
	}
	console.log(error)
	ElNotification({
		title:'请求失败',
		message: message.toString()
	})
	// console.log('error', error)
    return Promise.reject(error);
  });

const app = createApp(App)
// app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.provide('axios', axios)
app.mount('#app')


// window.addEventListener('keydown', (event)=>{
// 	console.log(event)
// })