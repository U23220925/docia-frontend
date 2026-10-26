<template>
  <div class="docia-shell-layout">
    <DociaShell />
    
    <div class="docia-contenido">
      <h2>Gestión documental</h2>

      <div class="docia-plano">
        <h3>Cargar documento</h3>
        <input type="file" @change="onFileChange" class="docia-input" style="padding:8px;" />
        <button class="docia-btn docia-btn-primario" @click="subir" :disabled="!archivo">Subir documento</button>
        
        <!-- Bloque de respuesta con los badges requeridos por el patrón -->
        <p v-if="resultado" style="margin-top:10px;">
          Subido: {{ resultado.nombreArchivo }} — Estado: 
          <span class="docia-estado docia-estado-indexado" v-if="resultado.estadoProcesamiento === 'INDEXADO'">Indexado</span>
          <span class="docia-estado docia-estado-error" v-else-if="resultado.estadoProcesamiento === 'ERROR'">Error</span>
          <span class="docia-estado docia-estado-procesando" v-else>Procesando</span>
        </p>
        <p v-if="error" style="color:var(--docia-rojo); margin-top:10px;">{{ error }}</p>
      </div>

      <div class="docia-plano">
        <h3>Documentos del proyecto</h3>
        <table class="docia-tabla">
          <thead>
            <tr>
              <th>Archivo</th>
              <th>Tipo</th>
              <th>Tamaño</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in documentos" :key="d.id">
              <td>{{ d.nombreArchivo }}</td>
              <td>{{ d.tipo }}</td>
              <td>{{ (d.tamanoBytes / 1024).toFixed(0) }} KB</td>
              <td>
                <span class="docia-estado docia-estado-indexado" v-if="d.estadoProcesamiento === 'INDEXADO'">Indexado</span>
                <span class="docia-estado docia-estado-error" v-else-if="d.estadoProcesamiento === 'ERROR'">Error</span>
                <span class="docia-estado docia-estado-procesando" v-else>Procesando</span>
              </td>
              <td style="font-family:var(--fuente-datos); font-size:0.82rem;">
                {{ d.fechaCarga ? new Date(d.fechaCarga).toLocaleDateString() : '—' }}
              </td>
            </tr>
            <tr v-if="documentos.length === 0">
              <td colspan="5" style="text-align: center; color: var(--docia-ink-suave); padding: 20px;">
                No hay documentos cargados en este proyecto.
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
const idProyecto = route.query.idProyecto;

const archivo = ref(null);
const resultado = ref(null);
const error = ref(null);
const documentos = ref([]);

function onFileChange(e) { 
  archivo.value = e.target.files[0]; 
}

async function cargarDocumentos() {
  if (!idProyecto) return;
  try {
    const { data } = await api.get(`/documentos?idProyecto=${idProyecto}`);
    documentos.value = data;
  } catch (e) {
    console.error("Error al obtener la lista de documentos:", e);
  }
}

async function subir() {
  if (!archivo.value) return;
  error.value = null;
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const formData = new FormData();
  formData.append('archivo', archivo.value);
  try {
    const { data } = await api.post(`/documentos?idProyecto=${idProyecto}&idUsuario=${usuario.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    resultado.value = data;
    archivo.value = null;
    await cargarDocumentos();
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al subir el documento';
  }
}

onMounted(() => {
  cargarDocumentos();
});
</script>
