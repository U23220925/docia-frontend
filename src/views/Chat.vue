<template>
  <div>
    <h2>Chat con el asistente IA</h2>
    <button v-if="idConversacion" @click="exportar">Exportar hilo a PDF</button>

    <div v-for="(m, i) in mensajes" :key="i" :style="{ textAlign: m.rol === 'USUARIO' ? 'right' : 'left' }">
      <p :style="{ background: m.corroborado === false ? '#fff3cd' : '#f1f1f1', display: 'inline-block', padding: '8px 12px', borderRadius: '8px' }">
        {{ m.contenido }}
      </p>
      <div v-if="m.citas && m.citas.length">
        <span v-for="c in m.citas" :key="c.idFragmento" style="font-size: 0.85em;">
          <button @click="verCita(c.idFragmento)">
            {{ c.nombreArchivo }}{{ c.pagina ? ' · Pág. ' + c.pagina : ' · frag. ' + c.orden }}
          </button>
        </span>
      </div>
    </div>

    <input v-model="pregunta" placeholder="Escribe tu consulta técnica..." @keyup.enter="enviar" />
    <button @click="enviar" :disabled="!pregunta">Enviar</button>

    <div v-if="citaVisible" style="border:1px solid #ccc; margin-top:15px; padding:10px;">
      <strong>{{ citaVisible.nombreArchivo }}</strong>
      <span v-if="citaVisible.pagina"> — página {{ citaVisible.pagina }}</span>
      <button @click="citaVisible = null" style="float:right;">Cerrar</button>
      <p>{{ citaVisible.texto }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const idProyecto = route.query.idProyecto;
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

const pregunta = ref('');
const idConversacion = ref(null);
const mensajes = ref([]);
const citaVisible = ref(null);

async function enviar() {
  const texto = pregunta.value;
  mensajes.value.push({ rol: 'USUARIO', contenido: texto });
  pregunta.value = '';
  try {
    const { data } = await api.post('/chat', {
      idProyecto, idUsuario: usuario.id, idConversacion: idConversacion.value, pregunta: texto
    });
    idConversacion.value = data.idConversacion;
    mensajes.value.push({ rol: 'ASISTENTE', contenido: data.respuesta, corroborado: data.corroborado, citas: data.citas });
  } catch (e) {
    mensajes.value.push({ rol: 'ASISTENTE', contenido: 'Ocurrió un error al consultar.', corroborado: false });
  }
}

async function exportar() {
  try {
    // CORRECCIÓN: Apuntamos al nuevo endpoint de exportación del ChatController
    const response = await api.get(`/chat/exportar/${idConversacion.value}`, { responseType: 'blob' });
    
    // Convertimos la respuesta binaria en un archivo descargable
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `conversacion-${idConversacion.value}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza de memoria
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al exportar la conversación a PDF:", error);
    alert("No se pudo exportar el hilo de conversación en este momento.");
  }
}

</script>