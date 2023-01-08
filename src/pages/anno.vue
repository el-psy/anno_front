<template>
	<div class="index">
		<Header></Header>
		<div class="row-container">
			<!-- <Aside></Aside> -->
			<main>
					<!-- <RouterView></RouterView> -->
					<RouterView v-slot="{ Component }">
						<KeepAlive>
							<component :is="Component" />
						</KeepAlive>
					</RouterView>
			</main>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import Header from '../components/Header.vue'
	// import Aside from '../components/Aside.vue'
	// import Main from '../components/Main.vue'
</script>
	
<style>
	div.index {
		width: 100vw;
		height: 100vh;

		display: flex;
		flex-direction: column;

		background: url('../assets/login_background.jpg') no-repeat center/cover ;
		background-color: rgba(90, 114, 189, 0.5);
		backdrop-filter: blur(2px);
	}
	div.row-container {
		flex: 1 1 0;

		display: flex;
		flex-direction: row;

		width: 100%;

		height: calc(100vh - 48px);
	}

	main {
		flex: 1 1 0;
		height: 100%;

		background-color: rgba(176, 92, 124, 0.5);
		backdrop-filter: blur(4px);
		overflow: auto;
	}
</style>