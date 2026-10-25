import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import GestionDocumental from '../views/GestionDocumental.vue';
import Dashboard from '../views/Dashboard.vue';
import Chat from '../views/Chat.vue';
import Usuarios from '../views/Usuarios.vue';
import Empresas from '../views/Empresas.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/documentos', component: GestionDocumental },
  { path: '/dashboard', component: Dashboard },
  { path: '/chat', component: Chat },
  { path: '/usuarios', component: Usuarios },
  { path: '/empresas', component: Empresas },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
