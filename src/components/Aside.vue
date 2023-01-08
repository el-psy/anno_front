<template>
	<aside>
		<ul class="aside-ul">
			<template v-for="item in aside_list" key="item.name">
				<li>
					<RouterLink :to="item.link">{{item.name}}</RouterLink>
				</li>
			</template>
		</ul>
	</aside>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { RouterLink } from 'vue-router';

	let aside_list = ref([
		{
			'name':'创建任务',
			'link':'/task/create'
		},
		{
			'name':'任务分配',
			'link':'/task/dist'
		},
		{
			'name':'任务信息',
			'link':'/task/message'
		},
		{
			'name':'任务管理',
			'link':'/task/control'
		}
	])
</script>

<style scoped>
	aside {
		background-color: rgba(191, 144, 109, 0.5);
		backdrop-filter: blur(4px);
	}
	.aside-ul {
		list-style: none;
		padding: 0;
	}
	.aside-ul li {
		/* padding: 16px 64px; */
		font-size: 16px;
		border-bottom: 1px solid rgb(191, 144, 109);
	}

	.aside-ul li a {
		display: block;
		padding: 16px 64px;
		color: #E11D48;
	}
	.aside-ul li a:hover {
		color: #4F46E5;
	}
</style>