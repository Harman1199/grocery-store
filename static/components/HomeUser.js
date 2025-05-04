export default {
	template: 
	`
	<div>
		<div v-if="!categories" class="container-fluid">
    		<div class="row text-center">
				<div class="alert alert-danger" style="position: fixed; bottom: 50%;">
					<p>
						<h1>Sorry, no results found !</h1>
					</p>
				</div>
			</div>				  		
    	</div>

    	<!-- Cards -->

    	<div class="container-fluid">
		    <div v-for="category in categories">
			    <div v-if="category.products.length !== 0">
			        <div class="row p-2">
			            <div class="col">
			                <div class="card border-dark mb-3 rounded-4">
			                    <div class="card-header border-dark">
			                        <h5 class="card-title">{{ category.name }}</h5>
			                    </div>
			                    <div class="card-body">
			                        <div class="row">
			                            <div v-for="product in category.products" class="col-lg-3 col-md-4 col-sm-6 mb-3">
			                                <div class="card border-dark rounded-3">
			                                    <div class="card-header">
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
			                                                    <button class="btn btn-lg btn-outline-dark rounded-3">
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
		</div>
	</div>
	`,
	data() {
		return {
			categories: null,
			email: localStorage.getItem('email'),
			token: localStorage.getItem('auth-token'),
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
			//console.log(data)
			this.categories = data
			//console.log(this.categories[0].products[0])
		} else {
			alert(data.message)
		}
	},
}