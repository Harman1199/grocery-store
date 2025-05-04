export default {
	template: 
	`

	<div class="container-fluid text-left">
		<div class="row justify-content-center">

			<div class="row justify-content-center">
				<div class="col-6 p-3">
					<br><br>
					<h1 style="text-align: center;">Login<br><br></h1></div>
			</div>

			<div class="col-5 p-3 border rounded-4">
				<div id="login-form">
					<div class="mb-3">
						<label for="email" class="form-label">Email</label>
						<input type="email" class="form-control border-secondary" 
						id="email" name="email"
						v-model='credentials.email' >
						<div id="text-email" class="form-text">
							Type email in the form: <i>abc</i><b>@xyz.com</b>
						</div>
					</div>

					<div class="mb-3">
						<label for="password" class="form-label">Password</label>
						<input type="password" class="form-control border-secondary" 
						name="password" id="password" 
						v-model='credentials.password' >
					</div>

					<div class="row justify-content-end">
						<div class="col-sm-auto"></div>
						<div v-if="error" class="col-4 alert alert-danger" role="alert">
							<p>{{error}}</p>
						</div>
						<div class="col-4 text-end justify-content-end">
							<div>
								<a href="#" class="btn btn-outline-dark btn-lg"
								@click='login'>
									Login
								</a>
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
			credentials: {
				email: null,
				password: null,
			},
			error: null,
		}
	},
	methods: {
		async login(){
			// console.log(this.credentials)
			const response = await fetch('/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',

				},
				body: JSON.stringify(this.credentials),
			})
			const data = await response.json()
			if (response.ok) {
				//console.log(data)
				if (data.token) {
					localStorage.setItem('auth-token', data.token)
					localStorage.setItem('role', data.role)
					localStorage.setItem('email', data.email)
					this.$router.push({path: '/'})
				}
			} else {
				//console.log(data.message)
				this.error = data.message
			}
		},
	},
}



