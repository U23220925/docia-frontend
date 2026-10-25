import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import GestionDocumental from '../views/GestionDocumental.vue';
import Dashboard from '../views/Dashboard.vue';
import Chat from '../views/Chat.vue';
import Usuarios from '../views/Usuarios.vue';
import Empresas from '../views/Empresas.vue';
import Tokens from '../views/Tokens.vue';
import Auditoria from '../views/Auditoria.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/documentos', component: GestionDocumental },
  { path: '/dashboard', component: Dashboard },
  { path: '/chat', component: Chat },
  { path: '/usuarios', component: Usuarios },
  { path: '/empresas', component: Empresas },
  { path: '/tokens', component: Tokens },
  { path: '/auditoria', component: Auditoria },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
