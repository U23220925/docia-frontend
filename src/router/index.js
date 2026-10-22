import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import GestionDocumental from '../views/GestionDocumental.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/documentos', component: GestionDocumental },
  { path: '/dashboard', component: Dashboard },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
