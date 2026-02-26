<template>
  <div class="login-view">
    <!-- Header -->
    <AuthHeader
      title="PORTAL DE "
      highlight="USUARIO"
      subtitle="Ingresa a tu lectura numerológica"
    />

    <!-- Card Login -->
    <div class="glass-card login-card">
      <!-- Decoraciones -->
      <span class="card-deco card-deco--moon">🌙</span>
      <span class="card-deco card-deco--star">✦</span>

      <h2 class="login-card__title">Acceso al Portal</h2>
      <p class="login-card__desc">Ingresa tus credenciales para continuar tu viaje.</p>

      <!-- Formulario -->
      <q-form @submit.prevent="handleLogin" class="login-form">
        <CosmicInput
          v-model="email"
          icon="alternate_email"
          label="Correo Electrónico"
          type="email"
          placeholder="tu@cosmos.com"
          :error="errors.email"
          @update:model-value="clearError('email')"
        />

        <CosmicInput
          v-model="password"
          icon="lock"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          :error="errors.password"
          @update:model-value="clearError('password')"
        />

        <!-- Olvidé contraseña -->
        <div class="login-card__forgot">
          <router-link to="/recuperar" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
        </div>

        <!-- Botón Login -->
        <CosmicButton
          label="Iniciar Sesión →"
          variant="orange"
          :loading="loading"
          loading-text="Verificando..."
          @click="handleLogin"
        />


      </q-form>

      <!-- Separador -->
      <div class="login-card__divider">
        <span>◇</span>
      </div>

      <!-- Link a registro -->
      <p class="login-card__register">
        ¿Aún no tienes cuenta?
        <router-link to="/registro" class="register-link">Registrarse</router-link>
      </p>
    </div>

    <!-- Footer -->
    <div class="login-footer">
      <span>DESTINO</span>
      <span class="footer-dot">•</span>
      <span>ENERGÍA</span>
      <span class="footer-dot">•</span>
      <span>CONEXIÓN</span>
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
const { errors, validateLogin, clearError, clearErrors } = useAuthForm();
const notify = useNotifications();

const email = ref("");
const password = ref("");
const loading = ref(false);

async function handleLogin() {
  // Validar campos
  if (!validateLogin(email.value, password.value)) {
    return;
  }

  loading.value = true;

  try {
    const res = await postData("usuarios/login", { email: email.value, password: password.value });

    // Guardar en store
    authStore.setAuth({
      token: res.token,
      usuario: res.usuario,
    });

    notify.success(` Bienvenido, ${res.usuario.nombre}`);

    // Redirigir según rol
    if (res.usuario.rol === "administrador") {
      router.push("/admin");
    } else if (res.usuario.estado === "activo") {
      router.push("/usuario/premium");
    } else {
      router.push("/usuario");
    }
  } catch (error) {
    const msg = error.response?.data?.msg || error.response?.data?.error || "Error al conectar con el servidor";
    notify.error(msg);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-view {
  width: 100%;
}

/* ── Card ── */
.login-card {
  position: relative;
  padding: 36px 32px;
  margin-bottom: 16px;
}

.login-card__title {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}

.login-card__desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 28px 0;
}

/* ── Decoraciones ── */
.card-deco {
  position: absolute;
  font-size: 1rem;
  opacity: 0.4;
  animation: pulse-glow 3s ease-in-out infinite;
}

.card-deco--moon {
  top: 24px;
  right: 28px;
  font-size: 1.2rem;
}

.card-deco--star {
  bottom: 120px;
  right: 32px;
  color: var(--violet-soft);
  font-size: 0.8rem;
  animation-delay: 1.5s;
}

/* ── Forgot ── */
.login-card__forgot {
  text-align: right;
  margin: -4px 0 20px 0;
}

.forgot-link {
  font-size: 0.78rem;
  color: var(--orange-primary);
  transition: color 0.3s;
}

.forgot-link:hover {
  color: var(--orange-light);
}



/* ── Divider ── */
.login-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  color: var(--text-muted);
  font-size: 0.7rem;
}

.login-card__divider::before,
.login-card__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border-subtle),
    transparent
  );
}

.login-card__divider span {
  padding: 0 16px;
}

/* ── Register link ── */
.login-card__register {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.register-link {
  font-weight: 700;
  color: var(--orange-primary);
  margin-left: 4px;
}

.register-link:hover {
  color: var(--orange-light);
}

/* ── Footer ── */
.login-footer {
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
  .login-card {
    padding: 28px 20px;
  }
}
</style>
