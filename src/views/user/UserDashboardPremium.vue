<template>
  <div class="premium-dashboard">
    <!-- ═══ Bienvenida Premium ═══ -->
    <section class="premium-welcome">
      <div class="premium-welcome__badge">
        <q-icon name="star" size="14px" />
        MIEMBRO PREMIUM
      </div>
      <p class="premium-welcome__date">{{ currentDate }}</p>
      <h1 class="premium-welcome__title">
        Bienvenido a tu Portal,
        <span class="premium-welcome__name">{{ authStore.nombreUsuario }}.</span>
      </h1>
      <p class="premium-welcome__desc">
        Tu alineación cósmica diaria te espera. Explora las energías del universo
        y descubre lo que los números revelan para ti hoy.
      </p>
    </section>

    <!-- ═══ Lectura Diaria ═══ -->
    <section class="daily-reading">
      <div class="section-header">
        <h2 class="section-header__title">
          <q-icon name="wb_sunny" size="22px" />
          Lectura Diaria
        </h2>
        <p class="section-header__desc">Tu guía numerológica para hoy.</p>
      </div>

      <!-- Botón generar -->
      <div v-if="!lecturaDiaria" class="daily-generate">
        <div class="daily-orb" @click="handleGenerarDiaria" :class="{ 'daily-orb--loading': generandoDiaria }">
          <div class="daily-orb__glow"></div>
          <div class="daily-orb__inner">
            <q-spinner-dots v-if="generandoDiaria" color="white" size="28px" />
            <q-icon v-else name="auto_awesome" size="32px" color="white" />
            <span class="daily-orb__text">{{ generandoDiaria ? 'CONSULTANDO...' : 'GENERAR LECTURA' }}</span>
            <span class="daily-orb__sub">DIARIA</span>
          </div>
        </div>
      </div>

      <!-- Lectura diaria generada -->
      <div v-else class="glass-card daily-card" @click="openReading(lecturaDiaria)">
        <div class="daily-card__header">
          <div class="daily-card__badge">
            <q-icon name="wb_sunny" size="14px" />
            Lectura del Día
          </div>
          <span class="daily-card__date">{{ formatDate(lecturaDiaria.fecha_lectura) }}</span>
        </div>
        <p class="daily-card__preview">
          {{ lecturaDiaria.contenido?.substring(0, 180) }}...
        </p>
        <span class="daily-card__cta">Click para ver lectura completa →</span>
      </div>
    </section>

    <!-- ═══ Lectura Principal ═══ -->
    <section v-if="lecturaPrincipal" class="principal-section">
      <div class="section-header">
        <h2 class="section-header__title">
          <q-icon name="auto_awesome" size="22px" />
          Tu Lectura Principal
        </h2>
        <p class="section-header__desc">El mapa numerológico de tu alma.</p>
      </div>

      <div class="glass-card principal-card" @click="openReading(lecturaPrincipal)">
        <div class="principal-card__header">
          <div class="principal-card__badge">
            <q-icon name="auto_awesome" size="14px" />
            Análisis Completo
          </div>
        </div>
        <p class="principal-card__preview">
          {{ lecturaPrincipal.contenido?.substring(0, 140) }}...
        </p>
        <span class="principal-card__cta">Click para ver lectura completa →</span>
      </div>
    </section>

    <!-- ═══ Historial de Lecturas ═══ -->
    <section class="history-section">
      <div class="section-header">
        <h2 class="section-header__title">
          <q-icon name="history" size="22px" />
          Historial de Lecturas
        </h2>
        <p class="section-header__desc">Todas tus consultas cósmicas.</p>
      </div>

      <!-- Loading -->
      <div v-if="loadingHistory" class="history-loading">
        <q-spinner-dots color="white" size="32px" />
        <span>Cargando historial...</span>
      </div>

      <!-- Vacío -->
      <div v-else-if="historial.length === 0" class="glass-card history-empty">
        <q-icon name="explore" size="40px" class="history-empty__icon" />
        <p class="history-empty__text">Aún no tienes lecturas. ¡Genera tu primera lectura diaria!</p>
      </div>

      <!-- Lista -->
      <div v-else class="history-list">
        <div v-for="lectura in historial" :key="lectura._id" class="glass-card history-item"
          @click="openReading(lectura)">
          <div class="history-item__left">
            <div class="history-item__type"
              :class="lectura.tipo === 'principal' ? 'history-item__type--principal' : 'history-item__type--diaria'">
              <q-icon :name="lectura.tipo === 'principal' ? 'auto_awesome' : 'wb_sunny'" size="16px" />
            </div>
            <div class="history-item__info">
              <span class="history-item__badge">{{ lectura.tipo === 'principal' ? 'Principal' : 'Diaria' }}</span>
              <span class="history-item__date">{{ formatDate(lectura.fecha_lectura) }}</span>
            </div>
          </div>

          <p class="history-item__preview">{{ lectura.contenido?.substring(0, 100) }}...</p>

          <q-icon name="chevron_right" size="18px" class="history-item__arrow" />
        </div>
      </div>
    </section>

    <!-- ═══ Perfil Rápido ═══ -->
    <section class="profile-section">
      <div class="glass-card profile-card">
        <h3 class="profile-card__title">
          <q-icon name="person" size="20px" />
          Tu Perfil Astral
        </h3>

        <div class="profile-card__grid">
          <div class="profile-field">
            <span class="profile-field__label">Nombre</span>
            <span class="profile-field__value">{{ authStore.nombreUsuario }}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field__label">Email</span>
            <span class="profile-field__value">{{ authStore.usuario?.email }}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field__label">Estado</span>
            <span class="profile-field__value">
              <span class="status-dot status-dot--active"></span>
              Premium
            </span>
          </div>
          <div class="profile-field">
            <span class="profile-field__label">Total Lecturas</span>
            <span class="profile-field__value">{{ historial.length }}</span>
          </div>
        </div>

        <router-link to="/usuario/perfil" class="profile-card__edit">
          <q-icon name="edit" size="14px" />
          Editar Perfil
        </router-link>
      </div>
    </section>

    <!-- ═══ Modal Lectura ═══ -->
    <transition name="modal">
      <div v-if="selectedReading" class="reading-modal-overlay" @click.self="selectedReading = null">
        <div class="reading-modal">
          <!-- Cerrar -->
          <button class="reading-modal__close" @click="selectedReading = null">
            <q-icon name="close" size="24px" />
          </button>

          <!-- Header -->
          <div class="reading-modal__header">
            <p class="reading-modal__badge">
              {{ selectedReading.tipo === 'principal' ? 'ANÁLISIS COMPLETO' : 'LECTURA DIARIA' }}
            </p>
            <h2 class="reading-modal__title">
              {{ selectedReading.tipo === 'principal' ? 'El Mapa de Tu Alma' : 'Tu Energía del Día' }}
            </h2>
            <p class="reading-modal__subtitle">
              {{ formatDate(selectedReading.fecha_lectura) }}
            </p>
          </div>

          <!-- Orbe decorativo -->
          <div class="reading-modal__orb">
            <img src="@/assets/icono/logo.svg" alt="Logo" class="reading-modal__orb-icon" />
          </div>

          <!-- Contenido -->
          <div class="reading-modal__content" v-html="formatContent(selectedReading.contenido)"></div>

          <!-- Footer -->
          <div class="reading-modal__footer">
            <button class="reading-modal__close-btn" @click="selectedReading = null">
              Cerrar Lectura
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { getData, postData } from "@/services/apiClient.js";
import { useNotifications } from "@/composables/useNotifications.js";

const authStore = useAuthStore();
const notify = useNotifications();

const lecturaPrincipal = ref(null);
const lecturaDiaria = ref(null);
const historial = ref([]);
const generandoDiaria = ref(false);
const loadingHistory = ref(true);
const selectedReading = ref(null);

const currentDate = computed(() => {
  return new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).replace(/^\w/, c => c.toUpperCase());
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace(/^\w/, c => c.toUpperCase());
}

function formatContent(text) {
  if (!text) return "";
  let html = text;
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="reading-bold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^### (.+)$/gm, '<h4 class="reading-h4">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="reading-h3">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="reading-h2">$1</h2>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  html = `<p>${html}</p>`;
  return html;
}

function openReading(lectura) {
  selectedReading.value = lectura;
}

// Cargar lecturas al montar
onMounted(async () => {
  const userId = authStore.usuario?.id || authStore.usuario?._id;
  if (!userId) return;

  try {
    const res = await getData(`lecturas/usuario/${userId}`);
    const lecturas = res.data || [];

    // Separar lecturas
    lecturaPrincipal.value = lecturas.find(l => l.tipo === "principal") || null;

    // Buscar lectura diaria de hoy
    const hoy = new Date().toDateString();
    const diariaHoy = lecturas.find(l =>
      l.tipo === "diaria" && new Date(l.fecha_lectura).toDateString() === hoy
    );
    lecturaDiaria.value = diariaHoy || null;

    // Historial completo
    historial.value = lecturas;
  } catch (error) {
    notify.error("Error al cargar tus lecturas");
  } finally {
    loadingHistory.value = false;
  }
});

// Generar lectura diaria
async function handleGenerarDiaria() {
  if (generandoDiaria.value) return;

  const userId = authStore.usuario?.id || authStore.usuario?._id;
  if (!userId) return;

  generandoDiaria.value = true;

  try {
    const res = await postData(`lecturas/diaria/${userId}`);
    lecturaDiaria.value = res.data;
    // Agregar al historial en la primera posición
    historial.value.unshift(res.data);
    notify.success("Tu lectura diaria ha sido revelada");
    selectedReading.value = res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      notify.warning("Ya generaste tu lectura diaria. Vuelve mañana.");
    } else {
      notify.error(
        error.response?.data?.error ||
        error.response?.data?.mensaje ||
        "Error al generar la lectura diaria"
      );
    }
  } finally {
    generandoDiaria.value = false;
  }
}
</script>

<style scoped>
.premium-dashboard {
  max-width: 900px;
  margin: 0 auto;
}

/* ═══ Bienvenida Premium ═══ */
.premium-welcome {
  text-align: center;
  margin-bottom: 48px;
}

.premium-welcome__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--orange-primary);
  background: rgba(232, 132, 42, 0.1);
  border: 1px solid rgba(232, 132, 42, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.premium-welcome__date {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--violet-soft);
  margin: 0 0 16px 0;
}

.premium-welcome__title {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0 0 16px 0;
}

.premium-welcome__name {
  display: block;
  background: linear-gradient(135deg, var(--orange-primary), var(--orange-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.premium-welcome__desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
}

/* ═══ Section Header ═══ */
.section-header {
  margin-bottom: 20px;
}

.section-header__title {
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.section-header__desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

/* ═══ Daily Reading ═══ */
.daily-reading {
  margin-bottom: 48px;
}

.daily-generate {
  text-align: center;
}

.daily-orb {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
  cursor: pointer;
}

.daily-orb__glow {
  position: absolute;
  inset: -18px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%);
  animation: pulse-daily 3s ease-in-out infinite;
}

.daily-orb__inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--violet-accent), var(--violet-mid));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 40px rgba(124, 58, 237, 0.35);
}

.daily-orb:hover .daily-orb__inner {
  transform: scale(1.05);
  box-shadow: 0 12px 50px rgba(124, 58, 237, 0.5);
}

.daily-orb--loading {
  pointer-events: none;
}

.daily-orb--loading .daily-orb__inner {
  opacity: 0.8;
}

.daily-orb__text {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: white;
  margin-top: 4px;
}

.daily-orb__sub {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes pulse-daily {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.12);
    opacity: 0.6;
  }
}

/* ═══ Daily Card ═══ */
.daily-card {
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.daily-card:hover {
  border-color: var(--violet-accent);
  transform: translateY(-2px);
}

.daily-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.daily-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--violet-soft);
  background: rgba(124, 58, 237, 0.12);
  padding: 4px 12px;
  border-radius: 12px;
}

.daily-card__date {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.daily-card__preview {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.daily-card__cta {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--violet-soft);
  letter-spacing: 0.03em;
}

/* ═══ Principal Section ═══ */
.principal-section {
  margin-bottom: 48px;
}

.principal-card {
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(232, 132, 42, 0.15);
}

.principal-card:hover {
  border-color: var(--orange-primary);
  transform: translateY(-2px);
}

.principal-card__header {
  margin-bottom: 12px;
}

.principal-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--orange-primary);
  background: rgba(232, 132, 42, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.principal-card__preview {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.principal-card__cta {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--orange-primary);
  letter-spacing: 0.03em;
}

/* ═══ History ═══ */
.history-section {
  margin-bottom: 48px;
}

.history-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.history-empty {
  text-align: center;
  padding: 40px;
}

.history-empty__icon {
  color: var(--text-muted);
  opacity: 0.4;
  margin-bottom: 12px;
}

.history-empty__text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-subtle);
}

.history-item:hover {
  border-color: var(--violet-accent);
  transform: translateX(4px);
}

.history-item__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.history-item__type {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-item__type--principal {
  background: rgba(232, 132, 42, 0.12);
  color: var(--orange-primary);
  border: 1px solid rgba(232, 132, 42, 0.25);
}

.history-item__type--diaria {
  background: rgba(124, 58, 237, 0.12);
  color: var(--violet-soft);
  border: 1px solid rgba(124, 58, 237, 0.25);
}

.history-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item__badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.history-item__date {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.history-item__preview {
  flex: 1;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-item__arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.history-item:hover .history-item__arrow {
  transform: translateX(4px);
  color: var(--violet-soft);
}

/* ═══ Profile ═══ */
.profile-section {
  margin-bottom: 24px;
}

.profile-card {
  padding: 28px;
}

.profile-card__title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
}

.profile-card__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 20px;
}

.profile-field__label {
  display: block;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.profile-field__value {
  font-size: 0.88rem;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-card__edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--orange-primary);
  text-decoration: none;
  transition: color 0.2s;
}

/* ═══ Reading Modal ═══ */
.reading-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 3, 18, 0.85);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 20px;
}

.reading-modal {
  position: relative;
  width: 100%;
  max-width: 720px;
  background:
    linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(232, 132, 42, 0.04) 100%),
    var(--cosmic-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.6);
}

.reading-modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.reading-modal__close:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.reading-modal__header {
  text-align: center;
  margin-bottom: 32px;
}

.reading-modal__badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--orange-primary);
  margin: 0 0 12px 0;
}

.reading-modal__title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.reading-modal__subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 480px;
  margin: 0 auto;
}

.reading-modal__orb {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
  border: 1px solid rgba(124, 58, 237, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
}

.reading-modal__orb-icon {
  width: 32px;
  height: 32px;
  color: var(--violet-soft);
  filter: drop-shadow(0 0 8px rgba(192, 132, 252, 0.6));
}

.reading-modal__content {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.reading-modal__content :deep(.reading-h2) {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--orange-primary);
  margin: 28px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(232, 132, 42, 0.15);
}

.reading-modal__content :deep(.reading-h3) {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--violet-soft);
  margin: 24px 0 8px;
}

.reading-modal__content :deep(.reading-h4) {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 20px 0 6px;
}

.reading-modal__content :deep(.reading-bold) {
  color: var(--text-primary);
  font-weight: 600;
}

.reading-modal__footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}

.reading-modal__close-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 32px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  color: var(--violet-soft);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reading-modal__close-btn:hover {
  background: rgba(124, 58, 237, 0.25);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .reading-modal,
.modal-leave-active .reading-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .reading-modal {
  transform: translateY(20px);
}

.modal-leave-to .reading-modal {
  transform: translateY(20px);
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .premium-welcome__title {
    font-size: 1.8rem;
  }

  .profile-card__grid {
    grid-template-columns: 1fr;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .history-item__preview {
    white-space: normal;
  }

  .history-item__arrow {
    display: none;
  }

  .reading-modal {
    padding: 32px 20px;
  }

  .reading-modal__title {
    font-size: 1.5rem;
  }
}
</style>
