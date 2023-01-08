// stores/counter.js
import { defineStore } from 'pinia'
import { getToken } from '../utils'

export const useStore = defineStore('counter', {
  state: () => {
    return {
      username:'',
      actor:'',
      taskname:'',
      tasklength:0
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    // set_username(name: string){
	// 	this.username = name
	// },
	// set_actor(actor: string){
	// 	this.actor = actor
	// }
  },
  persist:{
	enabled:true
  }
})