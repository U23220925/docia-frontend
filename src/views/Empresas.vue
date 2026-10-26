<template>
  <div class="docia-shell-layout">
    <DociaShell />
    <div class="docia-contenido">
      <h2>Empresas y proyectos</h2>

      <div class="docia-plano">
        <h3>Empresas</h3>
        <button class="docia-btn docia-btn-primario" @click="crearEmpresa" style="margin-bottom:12px;">+ Nueva empresa</button>
        <table class="docia-tabla">
          <thead>
            <tr>
              <th>Razón social</th>
              <th>RUC</th>
              <th>Plan</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in empresas" :key="e.id">
              <td>{{ e.razonSocial || e.razon_social }}</td>
              <td style="font-family:var(--fuente-datos); font-size:0.85rem;">{{ e.ruc }}</td>
              <td>{{ e.plan || 'ESTÁNDAR' }}</td>
              <td>
                <span class="docia-estado" :class="e.estado === 'ACTIVO' ? 'docia-estado-activo' : 'docia-estado-inactivo'">
                  {{ e.estado || 'Activo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="docia-plano">
        <h3>Proyectos vinculados</h3>
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px;">
          <select v-model="idEmpresaSel" @change="cargarProyectos" class="docia-input" style="width:280px; margin-bottom:0;">
            <option :value="null" disabled>Selecciona una empresa...</option>
            <option v-for="e in empresas" :key="e.id" :value="e.id">{{ e.razonSocial || e.razon_social }}</option>
          </select>
          <button class="docia-btn docia-btn-primario" @click="crearProyecto" :disabled="!idEmpresaSel">+ Nuevo proyecto</button>
        </div>

        <table class="docia-tabla">
          <thead>
            <tr>
              <th style="width: 150px;">Código</th>
              <th>Nombre del proyecto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in proyectos" :key="p.id">
              <td style="font-family: var(--fuente-datos); font-size: 0.85rem;">{{ p.codigo }}</td>
              <td>{{ p.nombre }}</td>
            </tr>
            <tr v-if="proyectos.length === 0">
              <td colspan="2" style="text-align: center; color: var(--docia-ink-suave); padding: 16px;">
                {{ idEmpresaSel ? 'No hay proyectos registrados para esta empresa.' : 'Selecciona una empresa para auditar sus proyectos.' }}
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

const empresas = ref([]);
const proyectos = ref([]);
const idEmpresaSel = ref(null);

async function cargarEmpresas() {
  try {
    const { data } = await api.get('/empresas');
    empresas.value = data;
  } catch (e) {
    console.error("Error al obtener las empresas:", e);
  }
}

async function cargarProyectos() {
  if (!idEmpresaSel.value) return;
  try {
    const { data } = await api.get(`/proyectos?idEmpresa=${idEmpresaSel.value}`);
    proyectos.value = data;
  } catch (e) {
    console.error("Error al obtener los proyectos:", e);
  }
}

async function crearEmpresa() {
  const razonSocial = prompt('Razón social de la empresa:');
  const ruc = prompt('Número de RUC:');
  if (razonSocial && ruc) {
    try {
      await api.post('/empresas', { razonSocial, ruc });
      await cargarEmpresas();
    } catch (e) {
      console.error("Error al registrar la empresa:", e);
    }
  }
}

async function crearProyecto() {
  const nombre = prompt('Nombre del proyecto:');
  const codigo = prompt('Código identificador:');
  if (nombre && codigo && idEmpresaSel.value) {
    try {
      await api.post('/proyectos', { nombre, codigo, idEmpresa: idEmpresaSel.value });
      await cargarProyectos();
    } catch (e) {
      console.error("Error al registrar el proyecto:", e);
    }
  }
}

onMounted(() => {
  cargarEmpresas();
});
</script>
