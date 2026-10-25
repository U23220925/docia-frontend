<template>
  <div>
    <h2>Gestión de usuarios y roles</h2>
    <button @click="crearUsuario">+ Nuevo usuario</button>
    <table border="1" cellpadding="6">
      <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
      <tr v-for="u in usuarios" :key="u.id">
        <td>{{ u.nombre }}</td><td>{{ u.correo }}</td><td>{{ u.rol }}</td><td>{{ u.estado }}</td>
        <td><button @click="toggleEstado(u)">{{ u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar' }}</button></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const usuarios = ref([]);
const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
const idEmpresa = usuarioActual.empresa?.id;

async function cargarUsuarios() {
  const { data } = await api.get(`/usuarios?idEmpresa=${idEmpresa}`);
  usuarios.value = data;
}

async function toggleEstado(u) {
  const nuevoEstado = u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  await api.put(`/usuarios/${u.id}/estado`, { estado: nuevoEstado });
  cargarUsuarios();
}

// Única función unificada que se conecta correctamente con tu DTO UsuarioRequest del Backend
async function crearUsuario() {
  const nombre = prompt('Nombre:');
  const correo = prompt('Correo:');
  const password = prompt('Contraseña:');
  const rol = prompt('Rol (ADMINISTRADOR / JEFE_PROYECTO / CONSULTOR):');
  if (nombre && correo && password && rol) {
    await api.post('/usuarios', { nombre, correo, password, rol, idEmpresa });
    cargarUsuarios();
  }
}

onMounted(cargarUsuarios);
</script>
