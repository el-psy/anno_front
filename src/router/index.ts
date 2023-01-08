import {createRouter, createWebHashHistory} from 'vue-router'
import { getToken, getRole } from '../utils'

import Login from '../pages/login.vue'
import Task from '../pages/task.vue'

import Anno from '../pages/anno.vue'

import taskcreate from '../components/taskcreate.vue';
import taskdist from '../components/taskdist.vue';
import taskmessage from '../components/taskmessage.vue'
import taskcontrol from '../components/taskcontrol.vue'

import annotask from '../components/annotask.vue';
import annodata from '../components/annodata.vue'

const routes = [
	{
		path:'/login',
		name:'login',
		component:Login
	},
	{
		path:'/task',
		name:'task',
		component:Task,
		redirect:'/task/create',
		children:[
			{
				path:'create',
				name:'task-create',
				component:taskcreate
			},
			{
				path:'dist',
				name:'task-dist',
				component:taskdist
			},
			{
				path:'message',
				name:'task-message',
				component:taskmessage
			},
			{
				path:'control',
				name:'task-control',
				component:taskcontrol
			}
		]
	},{
		path:'/anno',
		name:'anno',
		component:Anno,
		redirect:'/anno/task',
		children:[
			{
				path:'task',
				name:'anno-task',
				component: annotask
			},
			{
				path:'data/:taskname',
				name:'anno-data',
				component: annodata
			}
		]
	},
	{
		path:'/',
		name:'index',
		// component:Index,
		// redirect:'/task',
		beforeEnter:(to, from)=>{
			if(getRole()=='admin'){
				return {name:'task'}
			}else if(getRole()=='plain'){
				return {name:'anno'}
			}
		}
	},
]

const router = createRouter({
	history:createWebHashHistory(),
	routes
})

router.beforeEach((to, from)=>{
	if(getToken() || to.name == 'login'){
		// console.log(getToken())
		return true
	}
	return {name: 'login'}
})

export default router;