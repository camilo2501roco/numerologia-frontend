<template>
  <div class="register-view">
    <!-- Header -->
    <AuthHeader title="PORTAL " highlight="ASTRAL" subtitle="Descubre el destino escrito en tus números" />

    <!-- Card Registro -->
    <div class="glass-card register-card">
      <h2 class="register-card__title">Comienza tu viaje</h2>
      <p class="register-card__desc">
        Ingresa tus datos para generar tu perfil numerológico.
      </p>

      <!-- Formulario -->
      <q-form @submit.prevent="handleRegister" class="register-form">
        <CosmicInput v-model="nombre" icon="person_outline" label="Nombre Completo"
          placeholder="Ej. David Santiago Mancilla Gallo" :error="errors.nombre"
          @update:model-value="clearError('nombre')" />

        <CosmicInput v-model="email" icon="alternate_email" label="Correo Electrónico" type="email"
          placeholder="tu@cosmos.com" :error="errors.email" @update:model-value="clearError('email')" />

        <CosmicInput v-model="password" icon="lock" label="Contraseña" type="password" placeholder="Mínimo 6 caracteres"
          :error="errors.password" @update:model-value="clearError('password')" />

        <div class="register-card__date-field">
          <label class="date-label">Fecha de Nacimiento</label>
          <q-input v-model="fechaNacimiento" type="date" outlined dark class="cosmic-date-input"
            :class="{ 'cosmic-date-input--error': !!errors.fechaNacimiento }" :error="!!errors.fechaNacimiento"
            :error-message="errors.fechaNacimiento" hide-bottom-space
            @update:model-value="clearError('fechaNacimiento')">
            <template #prepend>
              <q-icon name="calendar_today" class="date-icon" />
            </template>
          </q-input>
          <p class="date-hint">La precisión es clave para tu carta natal.</p>
        </div>

        <!-- Botón Registro -->
        <CosmicButton label="Crear Cuenta ✦" variant="primary" :loading="loading" loading-text="Creando portal..."
          @click="handleRegister" />


      </q-form>

      <!-- Separador -->
      <div class="register-card__divider">
        <span>◇</span>
      </div>

      <!-- Link a login -->
      <p class="register-card__login">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="login-link">Iniciar sesión</router-link>
      </p>
    </div>

    <!-- Footer -->
    <div class="register-footer">
      <span>PRIVACIDAD</span>
      <span class="footer-dot">•</span>
      <span>TÉRMINOS</span>
      <span class="footer-dot">•</span>
      <span>SOPORTE</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";
import { useAuthForm } from "@/composables/useAuthForm.js";
import { useNotifications } from "@/composables/useNotifications.js";
import { postData } from "@/services/apiClient.js";
import AuthHeader from "@/components/Auth/AuthHeader.vue";
import CosmicInput from "@/components/Auth/CosmicInput.vue";
import CosmicButton from "@/components/Auth/CosmicButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const { errors, validateRegister, clearError, clearErrors } = useAuthForm();
const notify = useNotifications();

const nombre = ref("");
const email = ref("");
const password = ref("");
const fechaNacimiento = ref("");
const loading = ref(false);

async function handleRegister() {
  // Validar campos
  if (
    !validateRegister(
      nombre.value,
      email.value,
      password.value,
      fechaNacimiento.value
    )
  ) {
    return;
  }

  loading.value = true;

  try {
    const res = await postData("usuarios", {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      fechaNacimiento: fechaNacimiento.value,
    });

    // Guardar en store
    authStore.setAuth({
      token: res.token,
      usuario: res.usuario,
    });

    notify.success("¡Cuenta creada exitosamente! Redirigiendo...");

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    if (error.response?.data?.error) {
      notify.error(error.response.data.error);
    } else if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        notify.error(backendErrors[0].msg);
      }
    } else {
      notify.error("Error al conectar con el servidor");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-view {
  width: 100%;
}

/* ── Card ── */
.register-card {
  padding: 36px 32px;
  margin-bottom: 16px;
}

.register-card__title {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}

.register-card__desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 28px 0;
}

/* ── Campo Fecha ── */
.register-card__date-field {
  margin-bottom: 8px;
}

.date-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--orange-primary);
  margin-bottom: 8px;
}

.cosmic-date-input :deep(.q-field__control) {
  background: rgba(15, 14, 36, 0.8);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.cosmic-date-input :deep(.q-field__control:hover) {
  border-color: rgba(124, 58, 237, 0.4);
}

.cosmic-date-input :deep(.q-field--focused .q-field__control) {
  border-color: var(--orange-primary);
  box-shadow: 0 0 20px rgba(232, 132, 42, 0.15);
}

.cosmic-date-input :deep(.q-field__native) {
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.cosmic-date-input :deep(.q-field--outlined .q-field__control::before),
.cosmic-date-input :deep(.q-field--outlined .q-field__control::after) {
  border: none;
}

.cosmic-date-input--error :deep(.q-field__control) {
  border-color: var(--border-error) !important;
}

.cosmic-date-input :deep(.q-field__messages) {
  color: #ef4444;
  font-size: 0.75rem;
}

.date-icon {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.date-hint {
  font-size: 0.72rem;
  color: var(--text-gold);
  font-style: italic;
  margin: 6px 0 12px 0;
  opacity: 0.7;
}



/* ── Divider ── */
.register-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  color: var(--text-muted);
  font-size: 0.7rem;
}

.register-card__divider::before,
.register-card__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right,
      transparent,
      var(--border-subtle),
      transparent);
}

.register-card__divider span {
  padding: 0 16px;
}

/* ── Login link ── */
.register-card__login {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.login-link {
  font-weight: 700;
  color: var(--orange-primary);
  margin-left: 4px;
}

.login-link:hover {
  color: var(--orange-light);
}

/* ── Footer ── */
.register-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.footer-dot {
  color: var(--violet-accent);
  opacity: 0.6;
}

/* ── Transiciones ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 520px) {
  .register-card {
    padding: 28px 20px;
  }
}
</style>
