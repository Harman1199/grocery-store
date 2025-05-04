export default {
	template: 
	`
		<div class="container-fluid">
			<div class="container-fluid text-left">
	    		<div class="row">
	    			<div v-if="role == 'Store Manager'" class="col p-5">
	    				<h1>Requesting a new category:</h1>
	    			</div>
	    			<div v-else class="col p-5">
	    				<h1>Creating a new category:</h1>
	    			</div>
	    		</div>
    		</div>
			<div class="container rounded-4 text-center border">
	    		<div  id="create-category"> <!--######Form######-->
	    			<div class="row g-1">
	    					<div class="col-4 p-5">
	    						<label for="category_name" class="form-label">
	    							<h4>Category Name:</h4>
	    						</label>
	    					</div>
	    					<div class="col-8 p-5">
	    						<input v-model="category.name"
	    						type="text" class="form-control" 
	    						id="category_name" name="category_name"
	    						placeholder="Example: Fruits" required/>
	    					</div>
	    					<div>
	    						<input name="request_type" value="Category" type="hidden">
	    					</div>
	    			</div>
	    			<div class="row p-5">
	    				<div class="col-10">
	    					<div v-if="error" class="col-4 alert alert-danger" role="alert">
								<p>{{error}}</p>
							</div>
	    				</div>
	    				<div class="col-2 mb-3">
	    					<button class="btn btn-lg btn-success" 
	    					v-on:click="createCategory">
	    						Save
	    					</button>
	    				</div>
	    			</div>
	    		</div> <!--######Form######-->
    		</div>
		</div>
	`,

	data() {
		return {
			category: {
				name: null,
			},
			token: localStorage.getItem('auth-token'),
			role: localStorage.getItem('role'),
			error: null,
		}
	},
	methods: {
		async createCategory() {
			// console.log(this.category)
			const response = await fetch('/api/category', {
				method: "POST",
				headers: {
					'Authentication-Token': this.token,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(this.category),
			})

			const data = await response.json()
			if (response.ok) {
				if (this.role == 'Store Manager') {
					alert('Category requested!')
					this.$router.push('/')
				} else {
					alert(data.message)
					this.$router.push('/')
				}
			} else {
				this.error = data.message
			}
		}
	}
}