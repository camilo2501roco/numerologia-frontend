<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-header__title">
        <span class="title-portal">Portal del</span>
        <span class="title-admin">Administrador</span>
      </h1>
      <p class="dashboard-header__desc">
        Bienvenido al nexo de control. Gestiona el destino de la plataforma desde aquí.
      </p>
    </div>

    <!-- Cards de acceso rápido -->
    <div class="dashboard-cards">
      <router-link to="/admin/pagos" class="dashboard-card">
        <div class="dashboard-card__icon dashboard-card__icon--pagos">
          <q-icon name="payments" size="32px" />
        </div>
        <h3 class="dashboard-card__title">Ver Pagos</h3>
        <p class="dashboard-card__desc">Historial de transacciones y ofrendas digitales.</p>
      </router-link>

      <router-link to="/admin/usuarios" class="dashboard-card">
        <div class="dashboard-card__icon dashboard-card__icon--usuarios">
          <q-icon name="people" size="32px" />
        </div>
        <h3 class="dashboard-card__title">Ver Usuarios</h3>
        <p class="dashboard-card__desc">Almas registradas y perfiles astrales.</p>
      </router-link>
    </div>

    <!-- Stats footer -->
    <div class="dashboard-stats" v-if="stats">
      <div class="dashboard-stat">
        <span class="dashboard-stat__value">{{ stats.usuarios?.total || 0 }}</span>
        <span class="dashboard-stat__label">Total Almas</span>
      </div>
      <div class="dashboard-stat">
        <span class="dashboard-stat__value">{{ stats.pagos?.total || 0 }}</span>
        <span class="dashboard-stat__label">Transacciones</span>
      </div>
      <div class="dashboard-stat">
        <span class="dashboard-stat__value">${{ stats.pagos?.ingresoTotal || '0.00' }}</span>
        <span class="dashboard-stat__label">Ingresos Totales</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="dashboard-loading">
      <span class="dashboard-loading__spinner">✦</span>
      <p>Consultando el cosmos...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getData } from "@/services/apiClient.js";

const stats = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await getData("admin/dashboard");
    stats.value = res.estadisticas;
  } catch (error) {
    console.error("Error al cargar dashboard:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
}

/* ── Header ── */
.dashboard-header {
  text-align: center;
  margin-bottom: 50px;
}

.dashboard-header__title {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
}

.title-portal {
  display: block;
  color: var(--text-primary);
  font-size: 1.6rem;
  letter-spacing: 0.05em;
}

.title-admin {
  font-family: var(--font-display);
  font-weight: 900;
  color: var(--orange-primary);
  font-size: 2.8rem;
}

.dashboard-header__desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 12px;
  font-style: italic;
}

/* ── Cards ── */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 50px;
}

.dashboard-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 36px 28px;
  text-align: center;
  text-decoration: none;
  transition: all 0.35s ease;
  cursor: pointer;
}

.dashboard-card:hover {
  border-color: var(--violet-accent);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.15);
}

.dashboard-card__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 2px solid;
}

.dashboard-card__icon--pagos {
  background: radial-gradient(circle, rgba(245, 166, 35, 0.15) 0%, transparent 70%);
  border-color: rgba(245, 166, 35, 0.4);
  color: var(--orange-light);
}

.dashboard-card__icon--usuarios {
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
  border-color: rgba(124, 58, 237, 0.4);
  color: var(--violet-soft);
}

.dashboard-card__title {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.dashboard-card__desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ── Stats ── */
.dashboard-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding-top: 20px;
}

.dashboard-stat {
  text-align: center;
}

.dashboard-stat__value {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard-stat__label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--orange-primary);
  margin-top: 4px;
}

/* ── Loading ── */
.dashboard-loading {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.dashboard-loading__spinner {
  display: inline-block;
  font-size: 2rem;
  color: var(--violet-accent);
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dashboard-loading p {
  margin-top: 12px;
  font-size: 0.85rem;
  font-style: italic;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }

  .dashboard-stats {
    gap: 30px;
    flex-wrap: wrap;
  }

  .title-admin {
    font-size: 2rem;
  }
}
</style>
