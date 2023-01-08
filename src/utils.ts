let getToken = function(): void|string {
	if(sessionStorage.getItem('token')){
		return sessionStorage.getItem('token') as string
	}
}

let setToken = function(token: string){
	sessionStorage.setItem('token', token)
}

let delToken = function(){
	sessionStorage.removeItem('token')
}

let getRole = function(): void|string {
	if(sessionStorage.getItem('role')){
		return sessionStorage.getItem('role') as string
	}
}

let setRole = function(role: string){
	sessionStorage.setItem('role', role)
}

let delRole = function(){
	sessionStorage.removeItem('role')
}


export {
	getToken,
	setToken,
	delToken,
	getRole,
	setRole,
	delRole
}