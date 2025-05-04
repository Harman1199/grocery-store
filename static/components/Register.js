export default {
	template: 
	`
	<div class="container-fluid text-left">
		<div class="row justify-content-center">

			<div class="row justify-content-center">
				<div class="col-6 p-3">
					<br><br>
					<h1 style="text-align: center;">Sign Up<br><br></h1>
				</div>
			</div>

			<div class="col-5 p-3 border rounded-4">
				<div id="register-form">
					<div class="mb-3">
						<label for="email" class="form-label">Email</label>
						<input type="email" class="form-control border-secondary" 
						id="email" name="email"
						v-model='credentials.email' required>
						<div id="text-email" class="form-text">
							Type email in the form: <i>abc</i><b>@xyz.com</b>
						</div>
					</div>

					<div class="mb-3">
						<label for="password" class="form-label">Password</label>
						<input type="password" class="form-control border-secondary" 
						name="password" id="password" 
						v-model='credentials.password' required>
					</div>

					<div class="mb-3">
						<div>Role: {{ credentials.role }}</div>

						<input type="radio" id="User" value="User" 
						v-model="credentials.role" />
						<label for="User">User</label>

						<input type="radio" id="Store Manager" value="Store Manager" 
						v-model="credentials.role" />
						<label for="Store Manager">Store Manager</label>
					</div>

					<div class="row justify-content-end">
						<div class="col-sm-auto"></div>
						<div v-if="error" class="col-4 alert alert-danger" role="alert">
							<p>{{error}}</p>
						</div>
						<div class="col-4 text-end justify-content-end">
							<div>
								<button class="btn btn-outline-dark btn-lg"
								@click='register'>
									Register
								</button>
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
				role: "User",
			},
			error: null,
		}
	},
	methods: {
		async register(){
			// console.log(this.credentials)
			const res = await fetch('/user/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',

				},
				body: JSON.stringify(this.credentials),
			})
			const data = await res.json()
			if (res.ok) {
				localStorage.setItem('auth-token', data.token)
				localStorage.setItem('role', data.role)
				alert(data.message)
				this.$router.push('/user/login')
			} else {
				// console.log(data.message)
				this.error = data.message
			}
		},
	},
}



