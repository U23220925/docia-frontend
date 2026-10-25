<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h2>Bienvenido</h2>
    <button @click="crearProyecto" style="margin-bottom: 20px;">+ Nuevo proyecto</button>
    
    <div v-for="p in proyectos" :key="p.id" style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 6px; max-width: 500px;">
      <h3 style="margin: 0 0 10px 0;">{{ p.nombre }} ({{ p.codigo }})</h3>
      <p style="margin: 5px 0 15px 0; color: #555;">Documentos: {{ conteos[p.id] ?? '...' }}</p>
      
      <!-- Secciones de acción del proyecto separadas -->
      <div style="margin-bottom: 10px;">
        <router-link :to="`/documentos?idProyecto=${p.id}`" style="margin-right: 15px;">Ver documentos</router-link>
        <router-link :to="`/chat?idProyecto=${p.id}`">Consultar con IA</router-link>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;" />
      
      <!-- Menú global de navegación -->
      <div style="font-size: 0.9em;">
        <router-link p to="/usuarios">Administración de Usuarios</router-link>
        <span style="margin: 0 10px; color: #ccc;">|</span>
        <router-link to="/empresas">Gestión de Empresas</router-link>
        <router-link to="/auditoria">Auditoría</router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const proyectos = ref([]);
const conteos = ref({});

async function cargarProyectos() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const idEmpresa = usuario.empresa?.id;
  const { data } = await api.get(idEmpresa ? `/proyectos?idEmpresa=${idEmpresa}` : '/proyectos');
  proyectos.value = data;
  for (const p of data) {
    const { data: c } = await api.get(`/proyectos/${p.id}/conteo-documentos`);
    conteos.value[p.id] = c;
  }
}

// Única función unificada que envía la información estructurada de acuerdo a tu DTO en el Backend
async function crearProyecto() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const idEmpresa = usuario.empresa?.id;
  const nombre = prompt('Nombre del proyecto:');
  const codigo = prompt('Código:');
  if (nombre && codigo) {
    await api.post('/proyectos', { nombre, codigo, idEmpresa });
    cargarProyectos();
  }
}

onMounted(cargarProyectos);
</script>
