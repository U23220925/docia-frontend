<template>
  <div class="docia-shell-layout">
    <DociaShell />
    <div class="docia-contenido">
      <h2>Panel de consumo de tokens</h2>

      <!-- Bloque informativo de métricas de consumo de IA -->
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px;" v-if="resumen">
        <div class="docia-plano" style="text-align:center;">
          <div style="font-family:var(--fuente-titulo); font-size:1.8rem; color:var(--docia-navy);">
            {{ resumen.tokensEntrada || 0 }}
          </div>
          <div style="color:var(--docia-ink-suave); font-size:0.85rem;">Tokens de entrada</div>
        </div>
        <div class="docia-plano" style="text-align:center;">
          <div style="font-family:var(--fuente-titulo); font-size:1.8rem; color:var(--docia-navy);">
            {{ resumen.tokensSalida || 0 }}
          </div>
          <div style="color:var(--docia-ink-suave); font-size:0.85rem;">Tokens de salida</div>
        </div>
        <div class="docia-plano" style="text-align:center;">
          <div style="font-family:var(--fuente-titulo); font-size:1.8rem; color:var(--docia-navy);">
            {{ resumen.totalConsultas || 0 }}
          </div>
          <div style="color:var(--docia-ink-suave); font-size:0.85rem;">Consultas totales</div>
        </div>
      </div>

      <div class="docia-plano">
        <h3>Detalle por consulta</h3>
        <table class="docia-tabla">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Modelo utilizado</th>
              <th>Tokens Entrada</th>
              <th>Tokens Salida</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in consumos" :key="c.id">
              <td style="font-family:var(--fuente-datos); font-size:0.82rem;">
                {{ c.fecha ? new Date(c.fecha).toLocaleString() : '—' }}
              </td>
              <td>{{ c.modelo || 'Gemini Pro' }}</td>
              <td style="font-family:var(--fuente-datos);">{{ c.tokensEntrada }}</td>
              <td style="font-family:var(--fuente-datos);">{{ c.tokensSalida }}</td>
            </tr>
            <tr v-if="consumos.length === 0">
              <td colspan="4" style="text-align: center; color: var(--docia-ink-suave); padding: 16px;">
                No se registran consumos de procesamiento de IA para este proyecto.
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
import { useRoute } from 'vue-router';
import api from '../services/api';
import DociaShell from '../components/DociaShell.vue';

const route = useRoute();
// Recuperamos el idProyecto desde la url de navegación dinámicamente (?idProyecto=X)
const idProyecto = route.query.idProyecto;

const resumen = ref(null);
const consumos = ref([]);

async function cargarDatosConsumo() {
  if (!idProyecto) return;
  try {
    const { data: r } = await api.get(`/auditoria/tokens/resumen?idProyecto=${idProyecto}`);
    resumen.value = r;
  } catch (e) {
    console.error("Endpoint de resumen no soportado u omitido temporalmente.");
    resumen.value = { tokensEntrada: 0, tokensSalida: 0, totalConsultas: 0 };
  }

  try {
    const { data: c } = await api.get(`/auditoria/tokens?idProyecto=${idProyecto}`);
    consumos.value = c;
  } catch (e) {
    console.error("Error al obtener el listado detallado de tokens:", e);
  }
}

onMounted(() => {
  cargarDatosConsumo();
});
</script>
