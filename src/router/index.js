import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import GestionDocumental from '../views/GestionDocumental.vue';
import Dashboard from '../views/Dashboard.vue';
import Chat from '../views/Chat.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/documentos', component: GestionDocumental },
  { path: '/dashboard', component: Dashboard },
  { path: '/chat', component: Chat },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
