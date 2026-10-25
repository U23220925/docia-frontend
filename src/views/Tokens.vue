<template>
  <div>
    <h2>Panel de consumo de tokens</h2>
    <div v-if="resumen">
      <p><strong>Tokens de entrada:</strong> {{ resumen.tokensEntrada }}</p>
      <p><strong>Tokens de salida:</strong> {{ resumen.tokensSalida }}</p>
      <p><strong>Total de consultas:</strong> {{ resumen.totalConsultas }}</p>
    </div>
    <h3>Detalle por consulta</h3>
    <table border="1" cellpadding="6">
      <tr><th>Fecha</th><th>Modelo</th><th>Tokens entrada</th><th>Tokens salida</th></tr>
      <tr v-for="c in consumos" :key="c.id">
        <td>{{ new Date(c.fecha).toLocaleString() }}</td>
        <td>{{ c.modelo }}</td>
        <td>{{ c.tokensEntrada }}</td>
        <td>{{ c.tokensSalida }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const idProyecto = route.query.idProyecto;
const resumen = ref(null);
const consumos = ref([]);

async function cargar() {
  const { data: r } = await api.get(`/auditoria/tokens/resumen?idProyecto=${idProyecto}`);
  resumen.value = r;
  const { data: c } = await api.get(`/auditoria/tokens?idProyecto=${idProyecto}`);
  consumos.value = c;
}
onMounted(cargar);
</script>