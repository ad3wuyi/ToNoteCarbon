import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
// import piniaPersist from 'pinia-plugin-persistedstate';
import { hashPersistedStatePlugin } from './plugins/hashPersistedStatePlugin';

import VueTelInput from 'vue3-tel-input';
import 'vue3-tel-input/dist/vue3-tel-input.css';

import App from './App.vue';
import router from './router';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import VueLazyload from 'vue-lazyload';

const loadingImage = '/src/assets/empty.png';

const options = {
	position: 'top-right',
	timeout: 5000,
	closeOnClick: true,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
	draggablePercent: 0.6,
	showCloseButtonOnHover: false,
	hideProgressBar: false,
	closeButton: 'button',
	transition: 'Vue-Toastification__bounce',
	icon: true,
	rtl: false,
};

const app = createApp(App);

const pinia = createPinia();
// pinia.use(piniaPersist);
pinia.use(hashPersistedStatePlugin);

app.use(pinia);
app.use(router);
app.use(Toast, options);
app.use(VueLazyload, {
	preLoad: 1.3,
	loading: loadingImage,
	attempt: 1,
});
app.use(VueTelInput);

app.mount('#app');

