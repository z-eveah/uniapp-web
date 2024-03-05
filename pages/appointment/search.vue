<template>
	<view>
		<agreement ref="agreement"></agreement>
	</view>
</template>

<script>
	import agreement from '@/components/agreement/agreement.vue'
	export default {
		components: { agreement },
		onLoad(options){
			const type = options.type;
			const title = options.title;
			uni.setNavigationBarTitle({
				title:title
			})
			this.$refs.agreement.show(type);
		}
	}
</script>

<style>
</style>
