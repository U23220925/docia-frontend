<template>
  <div class="docia-topbar">
    <span>DocIA</span>
    <!-- Se protege la lectura soportando tanto razonSocial como razon_social -->
    <span class="empresa">
      {{ usuario?.empresa?.razonSocial || usuario?.empresa?.razon_social || 'Sin empresa' }}
    </span>
    <span>{{ usuario?.nombre || 'Usuario' }}</span>
  </div>
  
  <div class="docia-sidebar">
    <!-- Se usa 'ruta' de manera dinámica mediante computed -->
    <router-link to="/dashboard" :class="{ activo: ruta === '/dashboard' }">Dashboard</router-link>
    <router-link to="/documentos" :class="{ activo: ruta.startsWith('/documentos') }">Documentos</router-link>
    <router-link to="/chat" :class="{ activo: ruta.startsWith('/chat') }">Chat</router-link>
    <div class="separador"></div>
    <router-link to="/usuarios" :class="{ activo: ruta === '/usuarios' }">Administración</router-link>
    <router-link to="/empresas" :class="{ activo: ruta === '/empresas' }">Empresas</router-link>
    <router-link to="/auditoria" :class="{ activo: ruta === '/auditoria' }">Auditoría</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// CORRECCIÓN: Volvemos la ruta reactiva mediante un computed para que detecte los cambios de pantalla
const ruta = computed(() => route.path);

// Leemos el usuario de forma segura
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
</script>
