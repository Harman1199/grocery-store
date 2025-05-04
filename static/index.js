import router from './router.js'
import Navbar from './components/Navbar.js'

//Navigation Gaurd
router.beforeEach((to, from, next) => {
	if (to.name == 'Register') {
		next()
	} else if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false) {
		next({ name: 'Login' })
	} else {
		next()
	}
})

new Vue ({
	el: "#app",
	template: 
	`
	<div>
		<Navbar v-bind:key="load"/>
		<router-view class="m-5 container"/>
	</div>
	`,
	router,
	data: {
		load: true,
	},
	components: {
		Navbar,
	},
	watch: {
		$route(to, from) {
			this.load = !this.load
		}
	},

})