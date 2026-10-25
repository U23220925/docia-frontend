<template>
  <div>
    <h2>Auditoría de consultas</h2>
    <table border="1" cellpadding="6">
      <tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Entidad</th></tr>
      <tr v-for="a in registros" :key="a.id">
        <td>{{ new Date(a.fecha).toLocaleString() }}</td>
        <td>{{ a.usuario?.nombre ?? '—' }}</td>
        <td>{{ a.accion }}</td>
        <td>{{ a.entidad }} #{{ a.idEntidad }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const registros = ref([]);

async function cargar() {
  const { data } = await api.get('/auditoria');
  registros.value = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}
onMounted(cargar);
</script>