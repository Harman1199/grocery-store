import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Users from './components/Users.js'
import CategoryForm from './components/CategoryForm.js'
import CategoryUpdate from './components/CategoryUpdate.js'
import ProductForm from './components/ProductForm.js'
import ProductUpdate from './components/ProductUpdate.js'
import BuyProductForm from './components/BuyProductForm.js'
import Requests from './components/Requests.js'
import Cart from './components/Cart.js'
import SearchResults from './components/SearchResults.js'

const routes = [
	{path: '/welcome', name: 'Welcome'},
	{path: '/', component: Home, name: 'Home'},
	{path: '/admin/user', component: Users, name: 'Users'},
	{path: '/requests', component: Requests, name: 'Requests'},
	{path: '/category', component: CategoryForm, name: 'CategoryForm'},
	{path: '/category/:id', component: CategoryUpdate, name: 'CategoryUpdate'},
	{path: '/category/:id/product', component: ProductForm, name: 'ProductForm'},
	{path: '/product/:pid>', component: ProductUpdate, name: 'ProductUpdate'},
	{path: '/:email/:pid/buy', component: BuyProductForm, name: 'BuyProductForm'},
	{path: '/:email/cart', component: Cart, name: 'Cart'},
	{path: '/user/login', component: Login, name: 'Login'},
	{path: '/user/register', component: Register, name: 'Register'},
	{path: '/search/:query', component: SearchResults, name: 'Search'},
]

export default new VueRouter({
	routes
})