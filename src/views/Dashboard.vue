<template>
  <DociaShell />
  <div class="docia-contenido">
    <h2>Bienvenido, {{ usuario?.nombre || 'Usuario' }}</h2>
    <button class="docia-btn docia-btn-secundario" @click="crearProyecto">+ Nuevo proyecto</button>
    
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; margin-top:16px;">
      <div class="docia-plano" v-for="p in proyectos" :key="p.id">
        <h3>{{ p.nombre }}</h3>
        <p style="color:var(--docia-ink-suave); font-size:0.88rem;">
          {{ p.codigo }} · {{ conteos[p.id] !== undefined ? conteos[p.id] : '...' }} documentos
        </p>
        <router-link :to="`/documentos?idProyecto=${p.id}`" class="docia-btn docia-btn-secundario" style="margin-right:8px;">Documentos</router-link>
        <router-link :to="`/chat?idProyecto=${p.id}`" class="docia-btn docia-btn-primario">Consultar</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import DociaShell from '../components/DociaShell.vue';


const usuario = ref(JSON.parse(localStorage.getItem('usuario') || '{}'));

const proyectos = ref([]);
const conteos = ref({});

async function cargarProyectos() {
  try {
    const idEmpresa = usuario.value?.empresa && typeof usuario.value.empresa === 'object'
      ? usuario.value.empresa.id
      : (usuario.value?.idEmpresa || null);

    const endpoint = idEmpresa ? `/proyectos?idEmpresa=${idEmpresa}` : '/proyectos';
    const { data } = await api.get(endpoint);
    proyectos.value = data;

    for (const p of data) {
      api.get(`/documentos?idProyecto=${p.id}`)
        .then(({ data: docs }) => {
          if (Array.isArray(docs)) {
            conteos.value[p.id] = docs.length;
          } else {
            conteos.value[p.id] = 0;
          }
        })
        .catch(() => {
          conteos.value[p.id] = 0;
        });
    }
  } catch (e) {
    console.error("Error al cargar los proyectos o actualizar sus contadores:", e);
  }
}


async function crearProyecto() {
  const idEmpresa = usuario.value?.empresa && typeof usuario.value.empresa === 'object'
    ? usuario.value.empresa.id
    : (usuario.value?.idEmpresa || null);

  const nombre = prompt('Nombre del proyecto:');
  const codigo = prompt('Código del proyecto:');
  
  if (nombre && codigo) {
    try {
      await api.post('/proyectos', { nombre, codigo, idEmpresa });
      await cargarProyectos();
    } catch (e) {
      console.error("Error al registrar el proyecto:", e);
    }
  }
}

onMounted(() => {
  cargarProyectos();
});
</script>
