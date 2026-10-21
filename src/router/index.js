import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import GestionDocumental from '../views/GestionDocumental.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/documentos', component: GestionDocumental },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});