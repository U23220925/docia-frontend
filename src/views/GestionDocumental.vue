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
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
// Aquí lee de forma dinámica el id que viene desde el Dashboard (?idProyecto=X)
const idProyecto = route.query.idProyecto;

const archivo = ref(null);
const resultado = ref(null);
const error = ref(null);

function onFileChange(e) {
  archivo.value = e.target.files[0];
}

async function subir() {
  error.value = null;
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const formData = new FormData();
  formData.append('archivo', archivo.value);
  try {
    const { data } = await api.post(`/documentos?idProyecto=${idProyecto}&idUsuario=${usuario.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    resultado.value = data;
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al subir el documento';
  }
}
</script>
