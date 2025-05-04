export default {
	template: 
	`
	<div class="card" style="width: 20rem;">
		<div class="card-body">
			<h4 class="card-title text-center">{{name}}</h4>
		</div>

	  	<div class="card-body">
	  		<div class="row text-center">

	  			
				<ul class="list-group list-group-flush">
					<div v-for="product in products">
					    <div class="row py-2 g-3 px-2">
					    	<div class="col-sm-6 text-left rounded-pill ">
					    		<li class="align-middle list-group-item">
					    			{{ product.name }}
					    		</li>
					    	</div>
					    	<div v-if="role == 'Store Manager'" class="col-sm-6">
					    		<router-link :to="{ name: 'ProductUpdate', params: { pid: product.id}}">
						    		<button class="btn btn-lg btn-outline-primary">
						    			Edit
						    		</button>
							    </router-link>
					    		<button v-on:click="deleteProduct(product.id)" class="btn btn-lg btn-outline-danger">
					    			-
					    		</button>
					    	</div>
					    </div>
					</div>
		  		</ul>

	  			<div v-if="role == 'Store Manager'" class="col">
	  				<router-link :to="{ name: 'ProductForm', params: { id: id }}">
	  					<button class="btn btn-lg btn-primary rounded-circle">+</button>
	  				</router-link>
	  			</div>
	  		</div>
	  	</div>
	  	<div class="card-body">
	  		<div class="row">
	  			<div class="col-6 text-left">
	  				<router-link :to="{ name: 'CategoryUpdate', params: { id: id }}">
	  					<button class="btn btn-outline-primary btn-lg">Edit</button>
	  				</router-link>
	  			</div>
	  			<div v-if="role == 'Admin'" class="col-6 text-end">
	  				<button v-on:click="deleteCategory" class="btn btn-lg btn-danger">Delete</button>
	  			</div>
	  			<div v-if="role == 'Store Manager'" class="col-6 text-end">
	  				<button v-on:click="deleteRequest" class="btn btn-lg btn-danger">Delete</button>
	  			</div>
	  		</div>
	  	</div>
    </div>
	`,
	props: ['name', 'is_approved', 'id', 'products'],
	data() {
		return {
			token: localStorage.getItem('auth-token'),
			role: localStorage.getItem('role')
		}
	},
	methods: {
		async deleteCategory() {
			const id = this.id;
			if (confirm("Are you sure you want to delete this category?")) {
				const response = await fetch(`/api/category/${id}`, {
					method: "DELETE",
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
			} else {
				//this.$router.push('/')
				this.$router.go(0)
			}
		},
		async deleteRequest() {
			const id = this.id;
			if (confirm("Are you sure you want this category to be deleted?")) {
				const response = await fetch(`/api/category/${id}/delete`, {
					method: "POST",
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
			} else {
				//this.$router.push('/')
				this.$router.go(0)
			}
		},
		async deleteProduct(pid) {
			const id = this.id;
			if (confirm("Are you sure you want to delete this product?")) {
				const response = await fetch(`/api/category/${id}/product/${pid}`, {
					method: "DELETE",
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
			} else {
				//this.$router.push('/')
				this.$router.go(0)
			}
		},
	},
}

