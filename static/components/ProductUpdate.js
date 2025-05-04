export default {
	template: 
	`
	<div>
		<div class="container-fluid text-left">
    		<div class="row">
    			<div class="col p-5">
    				<h1>Updating {{product.name}}:</h1>
    			</div>
    		</div>
    	</div>

    	<div class="container">
    		<div id="update-product">
    			<div class="row g-3 mb-3">
    				<label for="name" class="col-sm-4 col-form-label" style="text-align: right;">Product Name:</label>
    				<div class="col-sm-6">
      					<input v-model="product.name" type="text" class="form-control" id="name" name="name" disabled>
    				</div>
    			</div>
    			<div class="row g-3 mb-3">
    				<label for="unit" class="col-sm-4 col-form-label" style="text-align: right;">Unit:</label>
    				<div class="col-sm-6">
      					<select v-model="product.unit" class="form-select" id="unit" name="unit" required>
	      					<option disabled value="">Please select the unit</option>
					      	<option value="Rs/Kg">Rs/Kg</option>
					      	<option value="Rs/Litre">Rs/Litre</option>
					      	<option value="Rs/dozen">Rs/dozen</option>
					      	<option value="Rs/gram">Rs/gram</option>
					      	<option value="Rs/Unit">Rs/Unit</option>
    					</select>
    				</div>
    			</div>
    			<div class="row g-3 mb-3">
    				<label for="rate" class="col-sm-4 col-form-label" style="text-align: right;">Rate:</label>
    				<div class="col-sm-6">
      					<input v-model="product.rate" type="number" class="form-control" id="rate" min="1" name="rate" required>
    				</div>
    			</div>
    			<div class="row g-3 mb-3">
    				<label for="stock" class="col-sm-4 col-form-label" style="text-align: right;">Quantity in Stock:</label>
    				<div class="col-sm-6">
      					<input v-model="product.stock" type="number" class="form-control" id="stock" min="1" name="stock" required>
    				</div>
    			</div>
    			<div class="row p-5">
    				<div class="col-sm-2"></div>
    				<div class="col-sm-6">
    					<div v-if="error" class="col-4 alert alert-danger" role="alert">
							<p>{{error}}</p>
						</div>
    				</div>
    				<div class="col-sm-4 mb-3" style="text-align: center;">
    					<button v-on:click="updateProduct" class="btn btn-lg btn-success">Save</button>
    				</div>
    			</div>
    		</div> <!--Form-->
    	</div>
    </div>
	`
	,

	data() {
		return {
			product: {
				name: null,
				unit: null,
				rate: null, 
				stock: null,
			},
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
		async updateProduct() {
			const pid = this.$route.params.pid;
			// console.log(this.product)
			const response = await fetch(`/api/product/${pid}`, {	
				method: "PUT",
				headers: {
					'Authentication-Token': this.token,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(this.product),
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