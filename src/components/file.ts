// import JSON;

let file_validation: any = {
	'node':{
		'structure':'{\n'+
		'    "sen": 句子内容,\n'+
		'    "tag":[ 标签内容，可选\n'+
		'        {\n'+
		'            "type":标签类型,\n'+
		'            "start":起始索引,\n'+
		'            "end":终点索引\n'+
		'        }\n'+
		'    ]\n'+
		'}\n',
		'validation':function(data: any, tags: any){
			tags = tags.map((item: any)=> item.name)
			// console.log('validation tags', tags)
			for(let sen_item of data){
				if(!sen_item.sen || typeof(sen_item.sen)!='string'){
					// console.log(sen_item.sen)
					// console.log(typeof(sen_item.sen))
					return false
				}
				if(sen_item.tag){
					for(let tag_item of sen_item.tag){
						// if(!tag_item.type || !tag_item.start || !tag_item.end){
						// 	console.log(tag_item, tag_item.type, tag_item.start, tag_item.end)
						// 	console.log(!tag_item.type || !tag_item.start || !tag_item.end)
						// 	return false
						// }
						if(typeof(tag_item.start)!='number' || typeof(tag_item.end)!='number' || tag_item.start>=tag_item.end || tag_item.end > sen_item.sen.length){
							// console.log(tag_item)
							// console.log(typeof(tag_item.start))
							// console.log(sen_item.sen.length)
							return false
						}
						if(!(tags.includes(tag_item.type))){
							// console.log(tag_item.type)
							return false
						}
					}
				}
				
			}
			return true
		},
		'deal':function(data: any){
			let res : any[] = []
			for(let index in data){
				res.push({
					id:parseInt(index),
					sen:data[index].sen,
					tag: JSON.stringify(data[index].tag) || ''
				})
			}
			return res
		},
		'export':function(data: any){
			let res: any[] = []
			for(let index in data){
				let item = data[index]
				res.push({
					sen: item['letters'],
					tags: JSON.parse(item['annos'])
				})
			}
			return res
		}
	},
	'relation':{
		'structure':'{\n'+
		'    "sen": 句子内容,\n'+
		'    "nodes":[ 节点内容\n'+
		'        {'+
		'            "type":标签类型,\n'+
		'            "start":起始索引,\n'+
		'            "end":终点索引\n'+
		'        }\n'+
		'    ],\n'+
		'    "relation":[ 关系内容 可选\n'+
		'        {\n'+
		'            "node_1": 节点1索引\n'+
		'            "node_2": 节点2索引\n'+
		'            "type": 关系类型\n'+
		'        },\n'+
		'    ],\n'+
		'}\n',
		'validation':function(data: any, tags: any){
			let node_tags = tags['node'].map((item: any)=> item.name);
			let relation_tags = tags['relation'].map((item: any)=>{
				return [item.name, item.nodes[0].name, item.nodes[1].name]
			})
			for(let sen_item of data){
				if(!sen_item.sen || typeof(sen_item.sen)!='string'){
					return false
				}
				for(let node_item of sen_item['nodes']){
					// if(!node_item.type || !node_item.start || !node_item.tags.end){
					// 	return false
					// }
					if(typeof(node_item.type)!=='string' || typeof(node_item.start)!='number' || typeof(node_item.end)!='number' || node_item.start>=node_item.end || node_item.end > sen_item.sen.length){
						return false
					}
					if(!(node_tags.includes(node_item.type))){
						return false
					}
				}
				for(let rel_item of sen_item['relation']){
					let mark = true
					let rel_no1_no2 = [rel_item['type'], sen_item['nodes'][rel_item['node_1']], sen_item['nodes'][rel_item['node_2']]]
					for(let rel of relation_tags){
						if(rel_no1_no2[0] == rel[0] && rel_no1_no2[1] == rel[1] && rel_no1_no2[2] == rel[2]){
							mark = false
						}
					}
					if(mark){
						return false
					}
				}
			}
			return true
		},
		'deal':function(data: any){
			let res : any[] = []
			for(let index in data){
				res.push({
					id:parseInt(index),
					sen:data[index].sen,
					nodes:data[index].nodes,
					relation:data[index].relation||[]
				})
			}
			return res
		},
		'export': function(data: any){
			let res: any[] = []
			return data
		}
	},
	'sentence_classifier':{
		'structure':'{\n'+
		'    "sen": 句子内容,\n'+
		'    "tag": 标签内容 可选\n'+
		'}\n',
		'validation':function(data: any, tags: any[]){
			tags = tags.map((item: any)=> item.name)
			for(let item of data){
				if(!item.sen || typeof(item.sen)!='string'){
					return false
				}
				if(typeof(item.tag)!='string' || !(tags.includes(item.tag))){
					return false
				}
			}
			return true
		},
		'deal':function(data: any){
			let res : any[] = []
			for(let index in data){
				res.push({
					id:parseInt(index),
					sen:data[index].sen,
					tags:JSON.stringify(data[index].tag) || ''
				})
			}
			return res
		},
		'export': function(data: any){
			let res: any[] = []
			return data
		}
	},
	'text_generation':{
		'structure':'{\n'+
		'    "sen": 句子内容,\n'+
		'    "tag": 标签内容 可选\n'+
		'}\n',
		'validation':function(data:any){
			for(let item of data){
				if(!item.sen || typeof(item.sen)!='string'){
					return false
				}
			}
			return true
		},
		'deal':function(data: any){
			let res : any[] = []
			for(let index in data){
				res.push({
					id:index,
					sen:data[parseInt(index)].sen,
					tags:data[index].tags||''
				})
			}
			return res
		},
		'export': function(data: any){
			let res: any[] = []
			return data
		}
	},
}

const type_name = [
	['node', '节点'],
	['relation', '关系'],
	['sentence_classifier', '句子分类'],
	['text_generation', '文本生成'],
]
const need_tag_map = {
	'node':'需要标签',
	'relation':'需要标签',
	'sentence_classifier':'需要标签',
	'text_generation':'无需标签'
}

let download_func = function(){
	let a = document.createElement('a')
	return function(text, name){
		let url = URL.createObjectURL(new File([text], name))
		a.href = url
		a.download = name
		a.click()
	}
}
let download = download_func()

export {
	file_validation,
	type_name,
	need_tag_map,
	download
}
