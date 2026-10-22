<template>
  <div>
    <h2>Bienvenido</h2>
    <button @click="crearProyecto">+ Nuevo proyecto</button>
    <div v-for="p in proyectos" :key="p.id" style="border:1px solid #ccc; padding:10px; margin:10px 0;">
      <strong>{{ p.nombre }}</strong> ({{ p.codigo }})
      <p>Documentos: {{ conteos[p.id] ?? '...' }}</p>
      <router-link :to="`/documentos?idProyecto=${p.id}`">Ver documentos</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const proyectos = ref([]);
const conteos = ref({});

async function cargarProyectos() {
  const { data } = await api.get('/proyectos');
  proyectos.value = data;
  for (const p of data) {
    const { data: conteo } = await api.get(`/proyectos/${p.id}/conteo-documentos`);
    conteos.value[p.id] = conteo;
  }
}

async function crearProyecto() {
  const nombre = prompt('Nombre del proyecto:');
  const codigo = prompt('Código (ej. XX-2026):');
  if (nombre && codigo) {
    await api.post('/proyectos', { nombre, codigo });
    cargarProyectos();
  }
}

onMounted(cargarProyectos);
</script>