/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

//import vue
window.Vue = require('vue');

/**
 * Vue - Router
 */
import VueRouter from 'vue-router'
Vue.use(VueRouter)
let routes = [
  { path: '/dashboard', component: require('./components/Dashboard.vue').default },
  { path: '/developer', component: require('./components/Developer.vue').default },
  { path: '/users', component: require('./components/Users.vue').default },
  { path: '/posts', component: require('./components/Posts.vue').default },
  { path: '/profile', component: require('./components/Profile.vue').default },
  { path: '*', component: require('./components/NotFound.vue').default }
]
const router = new VueRouter({
	mode: 'history',
  	routes // short for `routes: routes`
})


/**
 * import vue form
 */
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;
/* Global Component */
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


/**
 * import moment js
 */
import moment from 'moment'

/**
 * Vue Filters
 */
Vue.filter('upText', function(text){
	return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('myDate', function(date){
	return moment(date).format('MMMM Do YYYY');
});


/**
 * Vue progressbar
 */
import VueProgressBar from 'vue-progressbar'
const options = {
   color: '#bffaf3',
   failedColor: '#874b4b',
   thickness: '5px',
   height: '20px',
   transition: {
     speed: '0.2s',
     opacity: '0.6s',
     termination: 300
   },
   autoRevert: true,
   location: 'top',
   position: 'fixed',
   autoFinish: true,
   inverse: false
}
Vue.use(VueProgressBar, options)


/**
 * Gate for ACL in frontend
 */
import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user); // to use $gate anywhere in the application

/**
 * Sweet Alert 2
 */
import Swal from 'sweetalert2'
window.swal = Swal;
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
window.toast = Toast;


/**
 * Vue Custom Event
 */
window.Fire = new Vue();


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Laravel Vue Pagination
 */
Vue.component('pagination', require('laravel-vue-pagination'));

/**
 * Laravel Passport
 */
 Vue.component(
     'passport-clients',
     require('./components/passport/Clients.vue').default
 );

 Vue.component(
     'passport-authorized-clients',
     require('./components/passport/AuthorizedClients.vue').default
 );

 Vue.component(
     'passport-personal-access-tokens',
     require('./components/passport/PersonalAccessTokens.vue').default
 );


/**
 * Not Found component with SVG
 */
 Vue.component(
     'not-found',
     require('./components/NotFound.vue').default
 );


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
