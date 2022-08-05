<script>
	export default {
		onLaunch: function() {
			console.log('App Launch 1')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	html,body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
	ul {
		list-style: none;
		padding-left: 0;
	}
</style>
