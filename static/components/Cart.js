export default {
	template: 
	`
	<div>
		<div class="container-fluid">
			<div class="row p-2">
    			<div class="col">
    				<div class="card border-dark mb-3 rounded-4">
    					<div class="row">
    						<div class="col">
							  	<div class="card-body">
							  		<div class="row text-center align-self-center">
							  			<div class="col">
							  				<span class="align-middle"><h3>Product Name</h3></span>
							  			</div>
							  			<div class="col">
							  				<span class="align-middle"><h3>Rate Unit</h3></span>
							  			</div>
							  			<div class="col">
							  				<span class="align-middle"><h3>Quantity</h3></span>
							  			</div>
							  			<div class="col">
							  				<span class="align-middle"><h3>Total</h3></span>
							  			</div>
							  			<div class="col text-end">
							  				<span class="align-middle"><h3>Delete</h3></span>
							  			</div>
							  		</div>
							  	</div>
    						</div>
    					</div>
					</div>
    			</div>
    		</div>
    		<div v-for="order in orders">
    			<div v-if="!order.delivered">
	    		<div class="row p-2">
	    			<div class="col">
	    				<div class="card border-dark mb-3 rounded-4">
	    					<div class="row">
	    						<div class="col">
								  	<div class="card-body">
								  		<div class="row text-center align-self-center">
								  			<div class="col">
								  				<span class="align-middle">{{ order.product_name }}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">{{ order.rate }} {{ order.unit }}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">{{ order.quantity }}</span>
								  			</div>
								  			<div class="col">
								  				<span class="align-middle">Rs. {{ order.total }}</span>
								  			</div>
								  			<div class="col text-end">
							  					<button v-on:click="remove(order.id)"
							  					type="button" class="btn btn-danger rounded-3">
							  						Remove
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
    		<div class="row p-2">
    			<div class="col">
    				<div class="card border-dark mb-3 rounded-4">
    					<div class="row">
    						<div class="col">
							  	<div class="card-body">
							  		<div class="row text-center align-self-center">
							  			<div class="col">
							  				<span class="align-middle"><h3>Total amount to be paid:</h3></span>
							  			</div>
							  			<div class="col"></div>
							  			<div class="col"></div>
							  			<div class="col">
							  				<span class="badge text-bg-light"><h3>Rs. {{ transaction_total }}</h3></span>
							  			</div>
							  			<div class="col text-end">
						  					<button v-if="notAllDelivered" v-on:click="checkout"
						  					class="btn btn-success btn-lg align-self-center">
						  						Checkout
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
	`,

	data() {
		return {
			orders: null,
			transaction_total: null,
			email: localStorage.getItem('email'),
			token: localStorage.getItem('auth-token'),
		}
	},
	computed: {
	    notAllDelivered() {
	      return this.orders.some(order => !order.delivered);
	    },
  	},
	async created() {
    	const response = await fetch(`/${this.email}/cart`, {headers: {'Authentication-Token': this.token}})
    	const data = await response.json()
    	if (response.ok) {
    		this.orders = data.orders
    		this.transaction_total = data.transaction_total
    	} else {
    		console.log("Something went wrong !")
    	}
	},
	methods: {
		async remove(id) {
			const response = await fetch(`/order/${id}/delete`, {
				headers: {
					"Authentication-Token": this.token,
				},
			})

			const data = await response.json()
			if (response.ok) {
				this.$router.go(0)
			} else {
				console.log(data.message)
			}
		},
		async checkout() {
			const response = await fetch(`/${this.email}/checkout`, {
				headers: {
					"Authentication-Token": this.token,
				},
			})

			const data = await response.json()
			if (response.ok) {
				alert(data.message)
				this.$router.go(0)
			} else {
				console.log(data.message)
			}
		},
	},
}