export default {
	template: 
	`
	<div>
		<!-- Heading Bar -->

		<div class="row p-2">
			<div class="col">
				<div class="card border-dark mb-3 rounded-4">
					<div class="row">
						<div class="col">
						  	<div class="card-body">
						  		<div class="row text-center align-self-center">
						  			<div class="col">
						  				<span class="align-middle"><h3>Name</h3></span>
						  			</div>
						  			<div class="col">
						  				<span class="align-middle"><h3>Email</h3></span>
						  			</div>
						  			<div class="col">
						  				<span class="align-middle"><h3>Status</h3></span>
						  			</div>
						  			<div class="col">
						  				<span class="align-middle"><h3></h3></span>
						  			</div>
						  		</div>
						  	</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Managers -->

		<div v-for="(user, index) in users">
			<div v-if="!user.active">
				<div class="row p-2">
					<div class="col">
						<div class="card border-dark mb-3 rounded-4">
							<div class="row">
								<div class="col">
								  	<div class="card-body">
								  		<div class="row text-center align-self-center">
								  			<div class="col">
								  				<span class="align-middle">{{user.username}}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">{{user.email}}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">Not Approved</span>
								  			</div>
								  			<div class="col">
								  				<button v-on:click="approve(user.id)" class="btn btn-success rounded-3">
								  					Approve
								  				</button>
								  			</div>
								  		</div>
								  	</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
	data() {
		return {
			users: [],
			token: localStorage.getItem('auth-token')
			,
		}
	},
	
	async mounted() {
		const response = await fetch('/admin/user', {
			headers: {
				'Authentication-Token': this.token,
			},
		})
		const data = await response.json()
		if (response.ok) {
			// console.log(data)
			this.users = data
		}
	},

	methods: {
		async approve(user_id) {
			const response = await fetch(`/admin/user/activate_user/${user_id}`, {
				headers: {
				'Authentication-Token': this.token,
				},
			})
			const data = await response.json()
			alert(data.message)
			this.$router.go(0)
		}
	}
}