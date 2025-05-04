export default {
	template: 
	`
	<div class="container-fluid">
		<div v-if="role == 'Admin' || role == 'Store Manager'">
			<div v-if="!categories?.length && !products?.length" class="row text-center">
				<div class="alert alert-danger" style="position: fixed; bottom: 50%;">
					<p>
						<h1>Sorry, no results found !</h1>
					</p>
				</div>
			</div>
			<div v-if="categories.length !== 0" v-for="category in categories">
				<div v-if="category.is_approved">
		    		<div class="row p-2">
		    			<div class="col">
		    				<div class="card border-dark border-5 mb-3 rounded-4">
		    					<div class="row mb-3">
		    						<div class="col">
									  	<div class="card-body">
									  		<div class="row text-center align-self-center">
									  			<div class="col mb-3">
									  				<span class="align-middle">{{ category.name }}</span>
									  			</div>
									  			<div class="col mb-3">
									  				<router-link :to="{ name: 'CategoryUpdate', params: { id: category.id }}">
									  					<button class="btn btn-outline-primary btn-lg">Edit</button>
									  				</router-link>
									  			</div>
									  			<div class="col mb-3">
									  				<div v-if="role == 'Admin'" class="col-6 text-end">
										  				<button v-on:click="deleteCategory(category.id)" class="btn btn-lg btn-danger">Delete</button>
										  			</div>
										  			<div v-if="role == 'Store Manager'" class="col-6 text-end">
										  				<button v-on:click="deleteRequest(category.id)" class="btn btn-lg btn-danger">Delete</button>
										  			</div>
									  			</div>
									  		</div>

									  		<div v-for="product in category.products">
										  		<div class="card border-dark rounded-pill mb-3" style="max-width: 100rem;">
										  			<div class="card-body">
										  				<div class="row text-center align-self-center">
											  				<div class="col">{{ product.name }}</div>
												  			<div v-if="role == 'Store Manager'" class="col">
												  				<router-link :to="{ name: 'ProductUpdate', params: { pid: product.id}}">
														    		<button class="btn btn-lg btn-outline-primary">
														    			Edit
														    		</button>
															    </router-link>
												  			</div>
												  			<div v-if="role == 'Store Manager'" class="col">
												  				<button v-on:click="deleteProduct(product.id)" class="btn btn-lg btn-outline-danger">
													    			-
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
	    		</div>
			</div>
			<div v-if="products.length !== 0" v-for="product in products">
		  		<div class="card border-dark rounded-pill mb-3" style="max-width: 100rem;">
		  			<div class="card-body">
		  				<div class="row text-center align-self-center">
			  				<div class="col">{{ product.name }}</div>
				  			<div v-if="role == 'Store Manager'" class="col">
				  				<router-link :to="{ name: 'ProductUpdate', params: { pid: product.id}}">
						    		<button class="btn btn-lg btn-outline-primary">
						    			Edit
						    		</button>
							    </router-link>
				  			</div>
				  			<div v-if="role == 'Store Manager'" class="col">
				  				<button v-on:click="deleteProduct(product.id)" class="btn btn-lg btn-outline-danger">
					    			-
					    		</button>
				  			</div>
			  			</div>
			  		</div>
			  	</div>
			</div>
		</div>

		<!-- User -->

		<div v-else>
    		<div v-if="!categories?.length && !products?.length" class="row text-center">
				<div class="alert alert-danger" style="position: fixed; bottom: 50%;">
					<p>
						<h1>Sorry, no results found !</h1>
					</p>
				</div>
			</div>
    		<div v-if="categories.length !== 0" v-for="category in categories" :key="category.id">
    			<div v-if="category.is_approved">
					<div class="row p-2">
						<div class="col">
							<div class="card border-dark mb-3 rounded-4">
								<div class="card-header border-dark">
									<h5 class="card-title">{{ category.name }}</h5>
								</div>
								<div class="card-body">
									<div class="row">
										<div v-for="product in category.products" class="col-auto mb-3">
											<div class="card border-dark" style="max-width: 18rem; display: inline-block;">
												<div class="card-header mb-3">
													<div class="row">
														<div class="col align-self-center">{{ product.name }}</div>
														<div class="col align-self-center text-end">
															<h5><span class="badge text-bg-dark">{{ product.rate }} {{ product.unit }}</span></h5>
														</div>
													</div>
												</div>
												<div class="card-body">
													<div class="row justify-content-center">
														<div class="col-auto text-center">
															<router-link :to="{ name: 'BuyProductForm', params: { email: email, pid: product.id}}">
																<button class="btn btn-lg btn-outline-dark rounded">
																	Buy
																</button>
															</router-link>
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
			</div>

    		<div v-if="products.length !== 0" v-for="product in products">
  				<div class="col-auto">
			  		<div class="card border-dark mb-3" style="max-width: 18rem; display: inline-block;">
					  	<div class="card-header mb-3">
					  		<div class="row">
					  			<div class="col align-self-center">{{ product.name }}</div>
					  			<div class="col align-self-center text-end">
					  				<h5><span class="badge text-bg-dark">{{ product.rate }} {{ product.unit }}</span></h5>
					  			</div>
					  		</div>
					  	</div>
					  	<div class="card-body">
					  		<div class="row justify-content-center">
					  			<div class="col-auto text-center">
					  				<router-link :to="{ name: 'BuyProductForm', params: { email: email, pid: product.id}}">
					  					<button class="btn btn-lg btn-outline-dark rounded">
					  						Buy
					  					</button>
					  				</router-link>
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
			categories: null,
			products: null,
			role: localStorage.getItem('role'),
			email: localStorage.getItem('email'),
			token: localStorage.getItem('auth-token'),
		}
	},
	async mounted() {
		const query = this.$route.params.query
		const response = await fetch(`/search/${query}`, {
					headers: {
						'Authentication-Token': this.token,
					},
				})
				const data = await response.json()
				if (response.ok) {
					this.categories = data.categories
					this.products = data.products
					// console.log(this.categories)
					// console.log(this.products)
				} else {
					console.log("oops")
				}
	},
	methods: {
		async deleteCategory(id) {
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
		async deleteRequest(id) {
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