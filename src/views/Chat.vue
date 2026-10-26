<template>
  <div class="docia-shell-layout">
    <DociaShell />
    
    <div class="docia-contenido">
      <h2>Chat con el asistente IA</h2>
      <button v-if="idConversacion" class="docia-btn docia-btn-secundario" @click="exportar" style="margin-bottom:16px;">
        Exportar hilo a PDF
      </button>

      <div class="docia-plano" v-if="mensajes.length > 0">
        <div v-for="(m, i) in mensajes" :key="i" :style="{ textAlign: m.rol === 'USUARIO' ? 'right' : 'left', marginBottom: '10px' }">
          <p :class="m.rol === 'USUARIO' ? 'docia-mensaje-usuario' : ['docia-mensaje-asistente', { 'no-corroborado': m.corroborado === false }]">
            {{ m.contenido }}
          </p>
          <div v-if="m.citas && m.citas.length" style="margin-top: 4px;">
            <!-- CORRECCIÓN: Botones de cita utilizando la clase técnica docia-cita en vez de un span -->
            <button v-for="c in m.citas" :key="c.idFragmento" class="docia-cita" @click="verCita(c.idFragmento)">
              {{ c.nombreArchivo }}{{ c.pagina ? ' · pág. ' + c.pagina : ' · frag. ' + c.orden }}
            </button>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:8px; margin-top: 16px;">
        <input v-model="pregunta" class="docia-input" style="margin-bottom:0;" placeholder="Escribe tu consulta técnica..." @keyup.enter="enviar" />
        <button class="docia-btn docia-btn-primario" @click="enviar" :disabled="!pregunta">Enviar</button>
      </div>

      <!-- Detalle de la cita documental seleccionada -->
      <div v-if="citaVisible" class="docia-plano" style="margin-top:16px; border-left:3px solid var(--docia-cyan);">
        <strong>{{ citaVisible.nombreArchivo }}</strong>
        <span v-if="citaVisible.pagina" style="color:var(--docia-ink-suave);"> — página {{ citaVisible.pagina }}</span>
        <button class="docia-btn docia-btn-secundario" style="float:right; padding:3px 10px;" @click="citaVisible = null">Cerrar</button>
        <p style="font-family:var(--fuente-datos); font-size:0.88rem; margin-top:10px; clear:both;">{{ citaVisible.texto }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import DociaShell from '../components/DociaShell.vue';

const route = useRoute();
const idProyecto = route.query.idProyecto;
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

const pregunta = ref('');
const idConversacion = ref(null);
const mensajes = ref([]);
const citaVisible = ref(null);

async function enviar() {
  if (!pregunta.value.trim()) return;
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

async function verCita(idFragmento) {
  try {
    const { data } = await api.get(`/fragmentos/${idFragmento}`);
    citaVisible.value = { 
      nombreArchivo: data.documento?.nombreArchivo || 'Archivo desconocido', 
      pagina: data.pagina, 
      texto: data.texto 
    };
  } catch (e) {
    console.error("Error al obtener el fragmento de la cita:", e);
  }
}

async function exportar() {
  if (!idConversacion.value) return;
  try {
    const response = await api.get(`/conversaciones/${idConversacion.value}/exportar`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `conversacion-${idConversacion.value}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza óptima de memoria en el navegador
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al exportar la conversación:", error);
  }
}
</script>
