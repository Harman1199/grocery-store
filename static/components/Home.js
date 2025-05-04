import HomeAdmin from "./HomeAdmin.js"
import HomeManager from "./HomeManager.js"
import HomeUser from "./HomeUser.js"

export default {
	template: 
	`
	<div>
		<HomeAdmin :key="load" v-if="userRole=='Admin'"/>
		<HomeManager :key="load" v-if="userRole=='Store Manager'"/>
		<HomeUser :key="load" v-if="userRole=='User'"/>

	</div>
	`,

	data() {
		return {
			userRole: localStorage.getItem('role'),
			load: true,
		}
	},
	components: {
		HomeAdmin, HomeManager, HomeUser,
	},
	watch: {
		$route(to, from) {
			this.load = !this.load
		}
	}
}