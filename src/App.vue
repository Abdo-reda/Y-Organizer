<script setup lang="ts"></script>

<template>
	<RouterView v-slot="{ Component, route }">
		<!-- <Transition name="fade" mode="out-in"> -->
		<Suspense>
			<component :key="route.name" class="flex-1 max-h-full overflow-hidden" :is="Component" />
		</Suspense>
		<!-- </Transition> -->
	</RouterView>
</template>
