<template>
  <div>
    <h2>Empresas y proyectos</h2>
    <h3>Empresas</h3>
    <button @click="crearEmpresa">+ Nueva empresa</button>
    <table border="1" cellpadding="6">
      <tr><th>Razón social</th><th>RUC</th><th>Plan</th><th>Estado</th></tr>
      <tr v-for="e in empresas" :key="e.id">
        <td>{{ e.razonSocial }}</td><td>{{ e.ruc }}</td><td>{{ e.plan }}</td><td>{{ e.estado }}</td>
      </tr>
    </table>

    <h3>Proyectos</h3>
    <select v-model="idEmpresaSel" @change="cargarProyectos">
      <option v-for="e in empresas" :key="e.id" :value="e.id">{{ e.razonSocial }}</option>
    </select>
    <button @click="crearProyecto" :disabled="!idEmpresaSel">+ Nuevo proyecto</button>
    <table border="1" cellpadding="6">
      <tr><th>Código</th><th>Nombre</th></tr>
      <tr v-for="p in proyectos" :key="p.id"><td>{{ p.codigo }}</td><td>{{ p.nombre }}</td></tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const empresas = ref([]);
const proyectos = ref([]);
const idEmpresaSel = ref(null);

async function cargarEmpresas() {
  const { data } = await api.get('/empresas');
  empresas.value = data;
}

async function cargarProyectos() {
  if (!idEmpresaSel.value) return;
  const { data } = await api.get(`/proyectos?idEmpresa=${idEmpresaSel.value}`);
  proyectos.value = data;
}

async function crearEmpresa() {
  const razonSocial = prompt('Razón social:');
  const ruc = prompt('RUC:');
  if (razonSocial && ruc) { 
    await api.post('/empresas', { razonSocial, ruc }); 
    cargarEmpresas(); 
  }
}

// Única función unificada que envía el parámetro idEmpresa estructurado para tu backend
async function crearProyecto() {
  const nombre = prompt('Nombre del proyecto:');
  const codigo = prompt('Código:');
  if (nombre && codigo) {
    await api.post('/proyectos', { nombre, codigo, idEmpresa: idEmpresaSel.value });
    cargarProyectos();
  }
}

onMounted(cargarEmpresas);
</script>
