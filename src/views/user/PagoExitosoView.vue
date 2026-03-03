<template>
  <div class="pago-view">

    <!-- Loader mientras procesa -->
    <div v-if="procesando" class="pago-card pago-card--loading">
      <q-spinner-orbit color="orange" size="64px" />
      <p class="pago-card__msg">Verificando tu pago...</p>
    </div>

    <!-- Pago APROBADO -->
    <div v-else-if="estado === 'approved'" class="pago-card pago-card--success">
      <div class="pago-icon pago-icon--success">
        <q-icon name="verified" size="48px" />
      </div>
      <h2 class="pago-card__title">¡Pago Exitoso!</h2>
      <p class="pago-card__desc">
        Tu membresía Premium ha sido activada. Ya tienes acceso completo al universo numerológico.
      </p>
      <p class="pago-card__sub">Redirigiendo a tu portal premium en {{ countdown }}s...</p>
      <button class="btn-action" @click="irAPremium">
        Ir a mi Portal Premium →
      </button>
    </div>

    <!-- Pago PENDIENTE -->
    <div v-else-if="estado === 'pending'" class="pago-card pago-card--pending">
      <div class="pago-icon pago-icon--pending">
        <q-icon name="schedule" size="48px" />
      </div>
      <h2 class="pago-card__title">Pago Pendiente</h2>
      <p class="pago-card__desc">
        Tu pago está siendo procesado. Una vez confirmado por MercadoPago, tu membresía será activada automáticamente.
        Revisa tu correo para más detalles.
      </p>
      <button class="btn-action btn-action--secondary" @click="router.push('/usuario')">
        Volver al Dashboard
      </button>
    </div>

    <!-- Pago FALLIDO / CANCELADO -->
    <div v-else class="pago-card pago-card--error">
      <div class="pago-icon pago-icon--error">
        <q-icon name="error_outline" size="48px" />
      </div>
      <h2 class="pago-card__title">Pago no completado</h2>
      <p class="pago-card__desc">
        El pago fue cancelado o rechazado. Puedes intentarlo de nuevo cuando quieras, sin cargo.
      </p>
      <div class="pago-actions">
        <button class="btn-action" @click="router.push('/usuario/membresia')">
          Intentar de nuevo
        </button>
        <button class="btn-action btn-action--secondary" @click="router.push('/usuario')">
          Volver al Dashboard
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const procesando = ref(true);
const estado = ref(''); // 'approved' | 'pending' | 'failure' | ''
const countdown = ref(5);
let timer = null;

onMounted(() => {
  // MercadoPago agrega estos parámetros a la URL de retorno
  const status = route.query.status || route.query.collection_status || '';

  // Pequeña pausa para mostrar el loader (UX)
  setTimeout(() => {
    estado.value = status;
    procesando.value = false;

    if (status === 'approved') {
      // Actualizar el estado en el store localmente
      // El webhook ya habrá actualizado el backend, pero refrescamos el store para la sesión actual
      authStore.setAuth({
        token: authStore.token,
        usuario: {
          ...authStore.usuario,
          estado: 'activo',
        },
      });

      // Cuenta regresiva y redirección automática
      timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) irAPremium();
      }, 1000);
    }
  }, 1500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function irAPremium() {
  if (timer) clearInterval(timer);
  router.push('/usuario/premium');
}
</script>

<style scoped>
.pago-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 24px;
}

.pago-card {
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 48px 36px;
  text-align: center;
  backdrop-filter: blur(12px);
}

.pago-card--loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.pago-icon {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.pago-icon--success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.pago-icon--pending {
  background: rgba(234, 179, 8, 0.12);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #eab308;
}

.pago-icon--error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.pago-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.pago-card__desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.pago-card__msg {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.pago-card__sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0 0 24px 0;
}

.pago-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn-action {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--orange-primary), #f59e0b);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(232, 132, 42, 0.3);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(232, 132, 42, 0.4);
}

.btn-action--secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  color: var(--text-secondary);
}

.btn-action--secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: none;
  color: var(--text-primary);
}
</style>
