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
						  				<span class="align-middle"><h3>Category Name</h3></span>
						  			</div>
						  			<div class="col">
						  				<span class="align-middle"><h3>Request Type</h3></span>
						  			</div>
						  			<div v-if="role == 'Admin'" class="col">
						  				<span class="align-middle"><h3>Manager</h3></span>
						  			</div>
						  			<div v-if="role == 'Admin'" class="col">
						  				<span class="align-middle"><h3></h3></span>
						  			</div>
						  		</div>
						  	</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Requests -->

		<div v-for="(request, index) in requests">
			<div v-if="!request.is_approved">
				<div class="row p-2">
					<div class="col">
						<div class="card border-dark mb-3 rounded-4">
							<div class="row">
								<div class="col">
								  	<div class="card-body">
								  		<div class="row text-center align-self-center">
								  			<div class="col">
								  				<span class="align-middle">{{request.name}}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">{{request.request_type}}</span>
								  			</div>
								  			<div v-if="role == 'Admin'" class="col">
								  				<span class="align-middle">{{request.requestor}}</span>
								  			</div>
								  			<div v-if="role == 'Admin'" class="col">
								  				<button v-on:click="activate(request.id)" class="btn btn-success rounded-3">
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
			requests: [],
			token: localStorage.getItem('auth-token'),
			role: localStorage.getItem('role'),
		}
	},
	
	async mounted() {
		const response = await fetch('/api/category', {
			headers: {
				'Authentication-Token': this.token,
			},
		})
		const data = await response.json()
		if (response.ok) {
			// console.log(data)
			this.requests = data
		}
	},

	methods: {
		async activate(id) {
			const response = await fetch(`/category/${id}/activate`, {
				headers: {
				'Authentication-Token': this.token,
				},
			})
			const data = await response.json()
			if (response.ok) {
				alert(data.message)
				this.$router.go(0)
			} else {
				alert(data.message)
			}
			
		}
	}
}