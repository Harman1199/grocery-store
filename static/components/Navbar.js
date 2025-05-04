//import SearchResults from './components/SearchResults.js'

export default {
	template: 
	`
	<nav class="navbar navbar-expand-lg bg-success">
		<div class="container-fluid">
			<div>
				<router-link to="/">
					<span v-if="role=='Admin'" class="navbar-brand mb-0 h1" style=
					"color: White">Admin's Dashboard</span>
					<span v-if="role=='Store Manager'" class="navbar-brand mb-0 h1" style=
					"color: White">Manager's Dashboard</span>
					<span v-if="role=='User'" class="navbar-brand mb-0 h1" style=
					"color: White">User's Dashboard</span>
				</router-link>
			</div>

			<div v-if="token" class="d-flex align-items-center justify-content-center">
				<div id="search-form" class="text-center">
					<input v-model="query" type="search" name="q">
				</div>
				<router-link :to="{ name: 'Search', params: { query: query}}">
					<button class="btn btn-outline-light">
						Search 
					</button>
				</router-link>
			</div>


			<div class="collapse navbar-collapse justify-content-end">
				<ul class="navbar-nav">

					<!--Admin's Tabs-->

					<li class="nav-item" v-if="role=='Admin'">
						<router-link class="nav-link active" to="/requests">
							<span class="mb-0 h6" style="color: White">
								Category Requests
							</span>
						</router-link>
					</li>

					<li class="nav-item" v-if="role=='Admin'">
						<router-link class="nav-link active" to="/admin/user">
							<span class="mb-0 h6" style="color: White">
								Manager Requests
							</span>
						</router-link>
					</li>

					<!--Manager's Tabs-->

					<li class="nav-item" v-if="role=='Store Manager'">
						<router-link class="nav-link active" to="/requests">
							<span class="mb-0 h6" style="color: White">
								Pending Requests
							</span>
						</router-link>
					</li>

					<li class="nav-item" v-if="role=='Store Manager'">
						<button v-on:click="exportCsv" class="btn btn-outline-light">
							Products Summary 
						</button>
					</li>

					<!--User's Tabs-->

					<li class="nav-item" v-if="role=='User'">
						<router-link class="nav-link active" :to="{ name: 'Cart', params: { email: email }}">
							<span class="mb-0 h6" style="color: White">
								Cart
							</span>
						</router-link>
					</li>
				</ul>
			</div>

			<div v-if="token">
				<button class="btn btn-dark" @click='logOut'>
					LogOut
				</button>
			</div>
		</div>
    </nav>
	`,
	data() {
		return {
			query: null,
			role: localStorage.getItem('role'),
			email: localStorage.getItem('email'),
			token: localStorage.getItem('auth-token'),
		}
	},
	methods: {
		logOut() {
			localStorage.removeItem('auth-token')
			localStorage.removeItem('role')
			localStorage.removeItem('email')
			//this.$router.push('/')
			this.$router.go(0)
		},
		async exportCsv() {
			const response = await fetch('/csv')
			const data = await response.json()
			if (response.ok) {
				const t_id = data['Task ID']
				const interval = setInterval(async () => {
					const csv_resp = await fetch(`/csv/access/${t_id}`)
					if (csv_resp.ok) {
						clearInterval(interval)
						window.location.href = `/csv/access/${t_id}`
					}
				}, 1000)
			}
		},
	},
}