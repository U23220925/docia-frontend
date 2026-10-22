<template>
  <div>
    <h2>Gestión documental</h2>
    <input type="file" @change="onFileChange" />
    <button @click="subir" :disabled="!archivo">Subir documento</button>
    <p v-if="resultado">Subido: {{ resultado.nombreArchivo }} — Estado: {{ resultado.estadoProcesamiento }}</p>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'; // 1. Importamos el lector de rutas
import api from '../services/api';

const route = useRoute(); // 2. Instanciamos la ruta para leer la URL
const archivo = ref(null);
const resultado = ref(null);
const error = ref(null);

function onFileChange(e) {
  archivo.value = e.target.files[0];
}

async function subir() {
  error.value = null;
  
  // 3. Capturamos el idProyecto de la URL de forma dinámica
  const idProyecto = route.query.idProyecto || 1;

  const formData = new FormData();
  formData.append('archivo', archivo.value);
  try {
    // 4. Reemplazamos el ID fijo usando comillas invertidas `` y la variable \${idProyecto}
    const { data } = await api.post(`/documentos?idProyecto=${idProyecto}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    resultado.value = data;
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al subir el documento';
  }
}
</script>
