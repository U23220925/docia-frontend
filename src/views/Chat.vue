<template>
  <div>
    <h2>Chat con el asistente IA</h2>
    <div v-for="(m, i) in mensajes" :key="i" :style="{ textAlign: m.rol === 'USUARIO' ? 'right' : 'left' }">
      <p :style="{ background: m.corroborado === false ? '#fff3cd' : '#f1f1f1', display: 'inline-block', padding: '8px 12px', borderRadius: '8px' }">
        {{ m.contenido }}
      </p>
      <div v-if="m.citas && m.citas.length" style="font-size: 0.85em; color: #555;">
        Fuentes: {{ m.citas.join(' | ') }}
      </div>
    </div>
    <input v-model="pregunta" placeholder="Escribe tu consulta técnica..." @keyup.enter="enviar" />
    <button @click="enviar" :disabled="!pregunta">Enviar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const idProyecto = route.query.idProyecto;
const pregunta = ref('');
const idConversacion = ref(null);
const mensajes = ref([]);

async function enviar() {
  const texto = pregunta.value;
  mensajes.value.push({ rol: 'USUARIO', contenido: texto });
  pregunta.value = '';
  try {
    const { data } = await api.post('/chat', { idProyecto, idConversacion: idConversacion.value, pregunta: texto });
    idConversacion.value = data.idConversacion;
    mensajes.value.push({ rol: 'ASISTENTE', contenido: data.respuesta, corroborado: data.corroborado, citas: data.citas });
  } catch (e) {
    mensajes.value.push({ rol: 'ASISTENTE', contenido: 'Ocurrió un error al consultar.', corroborado: false });
  }
}
</script>