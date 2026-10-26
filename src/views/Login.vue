<template>
  <div style="min-height:100vh; display:flex; align-items:center; justify-content:center;">
    <div class="docia-plano" style="width:360px;">
      <h2 style="text-align:center;">DocIA</h2>
      <p style="text-align:center; color:var(--docia-ink-suave); margin-bottom:20px; font-size:0.9rem;">
        Tus expedientes técnicos, en lenguaje natural
      </p>
      <input class="docia-input" v-model="correo" placeholder="Correo electrónico" />
      <input class="docia-input" v-model="password" type="password" placeholder="Contraseña" />
      <button class="docia-btn docia-btn-primario" style="width:100%;" @click="iniciarSesion">Iniciar sesión</button>
      <p v-if="error" style="color:var(--docia-rojo); font-size:0.85rem; margin-top:10px;">{{ error }}</p>
    </div>
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
    router.push('/dashboard');
  } catch (e) {
    error.value = 'Credenciales incorrectas';
  }
}
</script>