<template>
  <div class="recuperar-view">
    <!-- ═══ PASO 1: Ingresar Email ═══ -->
    <div v-if="step === 1" class="step-container">
      <AuthHeader
        title="Restaura Tu "
        highlight="Conexión"
        subtitle="Ingresa el correo asociado a tu carta astral para recibir un código de recuperación."
      />

      <div class="glass-card recovery-card">
        <span class="card-deco card-deco--moon">🌙</span>
        <span class="card-deco card-deco--star">✦</span>

        <h2 class="recovery-card__title">Recuperar Acceso</h2>

        <q-form @submit.prevent="handleSendCode">
          <CosmicInput
            v-model="email"
            icon="alternate_email"
            label="Correo Electrónico"
            type="email"
            placeholder="tu@cosmos.com"
            :error="errors.email"
            @update:model-value="errors.email = ''"
          />

          <CosmicButton
            label="Enviar Código →"
            variant="orange"
            :loading="loading"
            loading-text="Enviando..."
            @click="handleSendCode"
          />
        </q-form>



        <div class="cosmic-divider"><span>◇</span></div>

        <p class="recovery-card__link">
          <router-link to="/login" class="back-link">← Volver al Login</router-link>
        </p>
      </div>
    </div>

    <!-- ═══ PASO 2: Verificar Código ═══ -->
    <div v-if="step === 2" class="step-container">
      <AuthHeader
        title="Verifica Tu "
        highlight="Esencia"
        subtitle="Hemos enviado un código celestial a tu correo. Ingrésalo a continuación."
      />

      <div class="glass-card recovery-card">
        <h2 class="recovery-card__title">Código de Verificación</h2>

        <q-form @submit.prevent="handleVerifyCode">
          <!-- 6 inputs individuales -->
          <div class="code-inputs">
            <input
              v-for="(digit, index) in codeDigits"
              :key="index"
              :ref="el => codeRefs[index] = el"
              type="text"
              maxlength="1"
              class="code-input"
              :class="{ 'code-input--filled': digit }"
              :value="digit"
              @input="handleCodeInput(index, $event)"
              @keydown="handleCodeKeydown(index, $event)"
              @paste="handleCodePaste($event)"
              inputmode="numeric"
            />
          </div>

          <!-- Timer -->
          <p class="code-timer" v-if="timerSeconds > 0">
            Las estrellas se alinean por los próximos
            <strong class="timer-value">{{ formatTimer }}</strong>
          </p>
          <p class="code-timer code-timer--expired" v-else>
            El código ha expirado.
            <a href="#" class="resend-link" @click.prevent="handleResend">Reenviar código</a>
          </p>

          <CosmicButton
            label="Validar Código →"
            variant="orange"
            :loading="loading"
            loading-text="Verificando..."
            @click="handleVerifyCode"
          />
        </q-form>



        <div class="recovery-card__footer">
          <p>
            ¿No recibiste el código?
            <a href="#" class="resend-link" @click.prevent="handleResend">Reenviar</a>
          </p>
        </div>
      </div>
    </div>

    <!-- ═══ PASO 3: Nueva Contraseña ═══ -->
    <div v-if="step === 3" class="step-container">
      <AuthHeader
        title="Forja Un "
        highlight="Nuevo Camino"
        subtitle="Alinea tu destino con una nueva clave segura."
      />

      <div class="glass-card recovery-card">
        <q-form @submit.prevent="handleChangePassword">
          <CosmicInput
            v-model="newPassword"
            icon="lock"
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            @update:model-value="errors.password = ''"
          />

          <CosmicInput
            v-model="confirmPassword"
            icon="lock_reset"
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            :error="errors.confirm"
            @update:model-value="errors.confirm = ''"
          />

          <!-- Indicador de fuerza -->
          <div class="strength-bar">
            <div class="strength-bar__segment" :class="strengthClass(1)"></div>
            <div class="strength-bar__segment" :class="strengthClass(2)"></div>
            <div class="strength-bar__segment" :class="strengthClass(3)"></div>
            <div class="strength-bar__segment" :class="strengthClass(4)"></div>
          </div>
          <p class="strength-label" v-if="newPassword">
            Fuerza: <strong :class="'strength--' + passwordStrength">{{ strengthText }}</strong>
          </p>

          <CosmicButton
            label="Restablecer Contraseña ✦"
            variant="orange"
            :loading="loading"
            loading-text="Actualizando..."
            @click="handleChangePassword"
          />
        </q-form>



        <p class="recovery-card__link">
          <router-link to="/login" class="back-link">Volver al Login</router-link>
        </p>
      </div>
    </div>

    <!-- ═══ PASO 4: Éxito ═══ -->
    <div v-if="step === 4" class="step-container">
      <div class="glass-card recovery-card success-card">
        <!-- Ícono éxito -->
        <div class="success-icon">
          <q-icon name="check" size="36px" />
        </div>

        <h2 class="success-title">Tu Destino Está Asegurado</h2>
        <p class="success-desc">
          Tu contraseña ha sido actualizada exitosamente en las estrellas.
          El cosmos está alineado para tu regreso.
        </p>

        <CosmicButton
          label="Volver al Login →"
          variant="orange"
          @click="$router.push('/login')"
        />

        <div class="cosmic-divider"><span>◇</span></div>

        <p class="success-footer">
          NUMEROLOGY SERVICE © 2025
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="cosmic-footer" v-if="step !== 4">
      <span>NUMEROLOGÍA</span>
      <span class="footer-dot">•</span>
      <span>DESTINO</span>
      <span class="footer-dot">•</span>
      <span>CONEXIÓN</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from "vue";
import AuthHeader from "@/components/Auth/AuthHeader.vue";
import CosmicInput from "@/components/Auth/CosmicInput.vue";
import CosmicButton from "@/components/Auth/CosmicButton.vue";
import { postData } from "@/services/apiClient.js";
import { useNotifications } from "@/composables/useNotifications.js";

// Estado general
const step = ref(1);
const loading = ref(false);
const notify = useNotifications();
const errors = ref({ email: "", password: "", confirm: "" });

// Paso 1
const email = ref("");

// Paso 2
const codeDigits = ref(["", "", "", "", "", ""]);
const codeRefs = ref([]);
const timerSeconds = ref(600); // 10 minutos
let timerInterval = null;

// Paso 3
const newPassword = ref("");
const confirmPassword = ref("");

// Timer
const formatTimer = computed(() => {
  const min = Math.floor(timerSeconds.value / 60);
  const sec = timerSeconds.value % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
});

function startTimer() {
  clearInterval(timerInterval);
  timerSeconds.value = 600;
  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

onUnmounted(() => clearInterval(timerInterval));

// ═══ Paso 1: Enviar código ═══
async function handleSendCode() {
  errors.value.email = "";

  if (!email.value.trim()) {
    errors.value.email = "El correo es obligatorio";
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = "Ingresa un correo válido";
    return;
  }

  loading.value = true;
  try {
    await postData("usuarios/olvide-contrasena", { email: email.value });
    notify.success("Código enviado a tu correo ✦");
    step.value = 2;
    startTimer();
    await nextTick();
    codeRefs.value[0]?.focus();
  } catch (error) {
    notify.error(error.response?.data?.msg || "Error al enviar código");
  } finally {
    loading.value = false;
  }
}

// ═══ Paso 2: Verificar código ═══
function handleCodeInput(index, event) {
  const value = event.target.value.replace(/\D/g, "");
  codeDigits.value[index] = value;

  if (value && index < 5) {
    codeRefs.value[index + 1]?.focus();
  }
}

function handleCodeKeydown(index, event) {
  if (event.key === "Backspace" && !codeDigits.value[index] && index > 0) {
    codeRefs.value[index - 1]?.focus();
  }
}

function handleCodePaste(event) {
  const paste = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  paste.split("").forEach((char, i) => {
    codeDigits.value[i] = char;
  });
  const focusIndex = Math.min(paste.length, 5);
  codeRefs.value[focusIndex]?.focus();
  event.preventDefault();
}

async function handleVerifyCode() {
  const code = codeDigits.value.join("");

  if (code.length < 6) {
    notify.warning("Ingresa el código completo de 6 dígitos");
    return;
  }

  loading.value = true;
  try {
    await postData("usuarios/verificar-codigo", { email: email.value, codigo: code });
    notify.success("Código verificado correctamente ✦");
    step.value = 3;
  } catch (error) {
    notify.error(error.response?.data?.msg || "Código inválido o expirado");
  } finally {
    loading.value = false;
  }
}

async function handleResend() {
  codeDigits.value = ["", "", "", "", "", ""];
  loading.value = true;
  try {
    await postData("usuarios/olvide-contrasena", { email: email.value });
    notify.success("Código reenviado a tu correo");
    startTimer();
    await nextTick();
    codeRefs.value[0]?.focus();
  } catch (error) {
    notify.error("Error al reenviar código");
  } finally {
    loading.value = false;
  }
}

// ═══ Paso 3: Nueva contraseña ═══
const passwordStrength = computed(() => {
  const p = newPassword.value;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthText = computed(() => {
  const texts = ["", "Débil", "Moderada", "Fuerte", "Muy Fuerte"];
  return texts[passwordStrength.value] || "";
});

function strengthClass(level) {
  return passwordStrength.value >= level ? `strength--${passwordStrength.value}` : "";
}

async function handleChangePassword() {
  errors.value.password = "";
  errors.value.confirm = "";

  if (!newPassword.value) {
    errors.value.password = "La contraseña es obligatoria";
    return;
  }
  if (newPassword.value.length < 6) {
    errors.value.password = "Mínimo 6 caracteres";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirm = "Las contraseñas no coinciden";
    return;
  }

  const code = codeDigits.value.join("");
  loading.value = true;
  try {
    await postData("usuarios/cambiar-contrasena", { email: email.value, codigo: code, nueva_contraseña: newPassword.value });
    notify.success("¡Contraseña actualizada exitosamente! ✦");
    step.value = 4;
    clearInterval(timerInterval);
  } catch (error) {
    notify.error(error.response?.data?.msg || "Error al cambiar contraseña");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.recuperar-view {
  width: 100%;
}

/* ── Card ── */
.recovery-card {
  position: relative;
  padding: 36px 32px;
  margin-bottom: 16px;
}

.recovery-card__title {
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  text-align: center;
}

/* Decoraciones */
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
  bottom: 80px;
  right: 32px;
  color: var(--violet-soft);
  font-size: 0.8rem;
  animation-delay: 1.5s;
}

/* ── Código inputs ── */
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.code-input {
  width: 48px;
  height: 56px;
  background: rgba(15, 14, 36, 0.8);
  border: 2px solid var(--border-subtle);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: all 0.25s ease;
  font-family: var(--font-body);
}

.code-input:focus {
  border-color: var(--orange-primary);
  box-shadow: 0 0 12px rgba(232, 132, 42, 0.3);
}

.code-input--filled {
  border-color: var(--orange-primary);
  background: rgba(232, 132, 42, 0.08);
}

/* Timer */
.code-timer {
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 20px;
}

.timer-value {
  color: var(--orange-primary);
  font-weight: 700;
}

.code-timer--expired {
  color: var(--text-muted);
}

.resend-link {
  color: var(--orange-primary);
  font-weight: 700;
  font-style: normal;
}

.resend-link:hover {
  color: var(--orange-light);
}

/* ── Fuerza contraseña ── */
.strength-bar {
  display: flex;
  gap: 6px;
  margin: -8px 0 6px 0;
}

.strength-bar__segment {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s ease;
}

.strength--1 { background: #ef4444; }
.strength--2 { background: #f59e0b; }
.strength--3 { background: #22c55e; }
.strength--4 { background: #22c55e; }

.strength-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0 0 20px 0;
}

.strength-label strong {
  font-weight: 700;
}

.strength--1 { color: #ef4444; }
.strength--2 { color: #f59e0b; }
.strength--3 { color: #22c55e; }
.strength--4 { color: #22c55e; }

/* ── Éxito ── */
.success-card {
  text-align: center;
  padding: 48px 32px;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange-primary), #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  box-shadow: 0 0 30px rgba(232, 132, 42, 0.4);
}

.success-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.success-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 28px 0;
}

.success-footer {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
}

/* ── Divider ── */
/* Responsive */
@media (max-width: 520px) {
  .recovery-card {
    padding: 28px 20px;
  }

  .code-input {
    width: 40px;
    height: 48px;
    font-size: 1.1rem;
  }

  .code-inputs {
    gap: 6px;
  }
}
</style>
