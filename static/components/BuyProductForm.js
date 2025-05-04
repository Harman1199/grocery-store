export default {
	template: 
	`
	<div>
		<div class="container-fluid text-left">
    		<div class="row">
    			<div class="col p-5">
    				<h1>{{ product.name }}</h1>
    			</div>
    		</div>
    	</div>

    	<div class="container">
    		<div id="buy-product">
    			<div class="row g-3 mb-3">
    				<label class="col-sm-4 col-form-label" style="text-align: right;">Availability:</label>
    				<div v-if="product.stock > 0" class="col-sm-6">
      					<p style="text-align: left; padding: 8px;">Available | {{ product.stock }} in stock</p>
    				</div>
    				<div v-if="product.stock < 1" class="col-sm-6">
      					<p style="text-align: left; padding: 8px;">Out of stock !</p>
    				</div>
    			</div>
    			<div class="row g-3 mb-3">
    				<label for="price" class="col-sm-4 col-form-label" style="text-align: right;">Price:</label>
    				<div class="col-sm-4">
    					<input type="number"class="form-control" name="price" id="price" v-model="product.rate" disabled >
    				</div>
    				<div class="col-form-label col-sm-2">
    					<span class="badge text-bg-dark">
    						{{ product.unit }}
    					</span>
    				</div>
    			</div>
    			<div v-if="product.stock > 0" class="row g-3 mb-3">
    				<label for="quantity" class="col-sm-4 col-form-label" style="text-align: right;">Quantity:</label>
    				<div class="col-sm-4">
      					<input v-model="quantity" type="number" class="form-control" id="quantity" name="quantity" min="1" :max="product.stock">
    				</div>
    			</div>
    			<div v-if="product.stock > 0" class="row p-5">
    				<div class="col-sm-6">
    					<div v-if="error" class="col-4 alert alert-danger" role="alert">
							<p>{{error}}</p>
						</div>
    				</div>
    				<div class="col-sm-6 mb-3" style="text-align: right;">
    					<button v-on:click="addToCart" class="btn btn-lg btn-success rounded-pill">Add to Cart</button>
    				</div>
    			</div>
    		</div>
    	</div>
   	</div>
	`,

	data() {
		return {
			product: {
				name: null,
				unit: null,
				rate: null, 
				stock: null,
			},
			quantity: 1,
			token: localStorage.getItem('auth-token'),
			error: null,
		}
	},
	created() {
		const pid = this.$route.params.pid;
    	fetch(`/api/product/${pid}`, {headers: {'Authentication-Token': this.token}}) // separate API for single product
			.then(response => response.json())
			.then(data => (this.product = data))
			.catch(error => (this.error = error));
	},
	methods: {
		async addToCart() {
			const email = this.$route.params.email
			const pid = this.$route.params.pid
			const response = await fetch(`/${email}/${pid}/buy`, {	
				method: "POST",
				headers: {
					"Authentication-Token": this.token,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(this.quantity),
			})

			const data = await response.json()
			if (response.ok) {
				alert(data.message)
				this.$router.push('/')
			} else {
				this.error = data.message
			}
		}
	}
}