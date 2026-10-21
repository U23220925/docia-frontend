<template>
  <div style="max-width: 320px; margin: 60px auto;">
    <h2>DocIA</h2>
    <p>Tus expedientes técnicos, en lenguaje natural</p>
    <input v-model="correo" placeholder="Correo electrónico" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="iniciarSesion">Iniciar sesión</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const correo = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();

async function iniciarSesion() {
  error.value = null;
  try {
    const { data } = await api.post('/usuarios/login', { correo: correo.value, password: password.value });
    localStorage.setItem('usuario', JSON.stringify(data));
    router.push('/documentos');
  } catch (e) {
    error.value = 'Credenciales incorrectas';
  }
}
</script>