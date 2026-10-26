<template>
  <div class="docia-shell-layout">
    <DociaShell />
    <div class="docia-contenido">
      <h2>Auditoría de consultas y acciones</h2>
      <div class="docia-plano">
        <table class="docia-tabla">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Operador</th>
              <th>Acción realizada</th>
              <th>Entidad afectada</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in registros" :key="a.id">
              <td style="font-family:var(--fuente-datos); font-size:0.82rem;">
                {{ a.fecha ? new Date(a.fecha).toLocaleString() : '—' }}
              </td>
              <td>{{ a.usuario?.nombre || 'Sistema de Limpieza' }}</td>
              <td>{{ a.accion }}</td>
              <td style="font-family:var(--fuente-datos); font-size:0.82rem;">
                {{ a.entidad || 'AUDITORIA' }} #{{ a.idEntidad || a.id }}
              </td>
            </tr>
            <tr v-if="registros.length === 0">
              <td colspan="4" style="text-align: center; color: var(--docia-ink-suave); padding: 16px;">
                No se registran eventos de auditoría en la base de datos central.
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

const registros = ref([]);

async function cargarHistorialAuditoria() {
  try {
    const { data } = await api.get('/auditoria');
    // Ordenamos cronológicamente en orden descendente (más reciente primero) de forma segura
    if (data && Array.isArray(data)) {
      registros.value = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else {
      registros.value = [];
    }
  } catch (e) {
    console.error("Error al obtener los registros de auditoría central:", e);
  }
}

onMounted(() => {
  cargarHistorialAuditoria();
});
</script>
