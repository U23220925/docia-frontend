<template>
  <div class="docia-shell-layout">
    <DociaShell />
    <div class="docia-contenido">
      <h2>Gestión de usuarios y roles</h2>
      <div class="docia-plano">
        <button class="docia-btn docia-btn-primario" @click="crearUsuario" style="margin-bottom:16px;">+ Nuevo usuario</button>
        <table class="docia-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.nombre }}</td>
              <td style="font-family:var(--fuente-datos); font-size:0.85rem;">{{ u.correo }}</td>
              <td>{{ u.rol }}</td>
              <td>
                <!-- CORRECCIÓN: Estructura de badge unificada mediante clases condicionales -->
                <span class="docia-estado" :class="u.estado === 'ACTIVO' ? 'docia-estado-activo' : 'docia-estado-inactivo'">
                  {{ u.estado === 'ACTIVO' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <button class="docia-btn docia-btn-secundario" @click="toggleEstado(u)">
                  {{ u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
            <tr v-if="usuarios.length === 0">
              <td colspan="5" style="text-align: center; color: var(--docia-ink-suave); padding: 20px;">
                No se encontraron usuarios registrados para esta empresa.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import DociaShell from '../components/DociaShell.vue';

const usuarios = ref([]);
const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
const idEmpresa = usuarioActual.empresa?.id || usuarioActual.idEmpresa;

async function cargarUsuarios() {
  if (!idEmpresa) return;
  try {
    const { data } = await api.get(`/usuarios?idEmpresa=${idEmpresa}`);
    usuarios.value = data;
  } catch (e) {
    console.error("Error al obtener los usuarios:", e);
  }
}

async function crearUsuario() {
  const nombre = prompt('Nombre:');
  const correo = prompt('Correo electrónico:');
  const password = prompt('Contraseña temporal:');
  const rol = prompt('Rol (ADMINISTRADOR / JEFE_PROYECTO / CONSULTOR):');
  
  if (nombre && correo && password && rol) {
    try {
      await api.post('/usuarios', { nombre, correo, password, rol, idEmpresa });
      await cargarUsuarios();
    } catch (e) {
      console.error("Error al registrar el nuevo usuario:", e);
    }
  }
}

async function toggleEstado(u) {
  const nuevoEstado = u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  try {
    await api.put(`/usuarios/${u.id}/estado`, { estado: nuevoEstado });
    await cargarUsuarios();
  } catch (e) {
    console.error("Error al modificar el estado del usuario:", e);
  }
}

onMounted(() => {
  cargarUsuarios();
});
</script>
