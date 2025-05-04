import Category from "./Category.js"


export default {
	template: 
	`
	<div>
		<div v-if="!categories" class="container-fluid">
	    	<div class="container-fluid text-center">
	    		<div class="row">
	    			<div class="col p-5">
	    				<p>No categories or products created or active.</p>
	    			</div>
	    		</div>
	    	</div>
		</div>
		<div class="row row-cols-4 p-2 g-2">
			<div v-for="category in categories" class="col py-2">
				<div v-if="category.is_approved">
					<Category :name="category.name" :id="category.id" 
					:products="category.products"/>
				</div>
			</div>
		</div>

    	<router-link to="/category">
    		<button type="button" class="btn btn-success btn-lg" 
    		style="position: fixed;bottom: 40px; right: 40px;">
    			Request New
    		</button>
    	</router-link>
	</div>
	`,
	data() {
		return {
			categories: null,
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
	components: {
		Category
	}
}