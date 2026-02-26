<template>
  <div class="user-perfil">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-header__title">
        <q-icon name="person" size="28px" class="page-header__icon" />
        Tu Perfil Astral
      </h1>
      <p class="page-header__desc">Actualiza los detalles de tu carta cósmica.</p>
    </div>

    <!-- Card perfil -->
    <div class="glass-card perfil-card">
      <!-- Avatar grande -->
      <div class="perfil-avatar">
        <div class="perfil-avatar__circle">
          {{ initials }}
        </div>
        <div class="perfil-avatar__info">
          <h2 class="perfil-avatar__name">{{ authStore.nombreUsuario }}</h2>
          <span class="perfil-avatar__badge" :class="isActive ? 'badge--active' : 'badge--free'">
            {{ isActive ? '✦ Premium' : '○ Plan Gratuito' }}
          </span>
        </div>
      </div>

      <!-- Formulario -->
      <q-form @submit.prevent="handleSave">
        <div class="perfil-form">
          <CosmicInput
            v-model="nombre"
            icon="person"
            label="Nombre Completo"
            type="text"
            placeholder="Tu nombre"
            :error="errors.nombre"
            @update:model-value="errors.nombre = ''"
          />

          <CosmicInput
            v-model="email"
            icon="alternate_email"
            label="Correo Electrónico"
            type="email"
            placeholder="tu@cosmos.com"
            :error="errors.email"
            @update:model-value="errors.email = ''"
          />

          <CosmicInput
            v-model="fechaNacimiento"
            icon="cake"
            label="Fecha de Nacimiento"
            type="date"
            :error="errors.fechaNacimiento"
            @update:model-value="errors.fechaNacimiento = ''"
          />
        </div>

        <!-- Botones -->
        <div class="perfil-actions">
          <CosmicButton
            label="Guardar Cambios ✦"
            variant="orange"
            :loading="saving"
            loading-text="Guardando..."
            @click="handleSave"
          />
        </div>
      </q-form>


    </div>

    <!-- Volver -->
    <p class="perfil-back">
      <router-link :to="isActive ? '/usuario/premium' : '/usuario'" class="back-link">← Volver al Dashboard</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/store/auth.js";
import { getData, putData } from "@/services/apiClient.js";
import { useNotifications } from "@/composables/useNotifications.js";
import CosmicInput from "@/components/Auth/CosmicInput.vue";
import CosmicButton from "@/components/Auth/CosmicButton.vue";

const authStore = useAuthStore();
const notify = useNotifications();

const nombre = ref("");
const email = ref("");
const fechaNacimiento = ref("");
const saving = ref(false);
const errors = ref({ nombre: "", email: "", fechaNacimiento: "" });

const isActive = computed(() => authStore.usuario?.estado === "activo");

const initials = computed(() => {
  const name = authStore.nombreUsuario;
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

onMounted(async () => {
  nombre.value = authStore.nombreUsuario || "";
  email.value = authStore.usuario?.email || "";

  // Cargar perfil completo del backend (incluye fechaNacimiento)
  try {
    const res = await getData("usuarios/perfil");
    const perfil = res.usuario || res;
    if (perfil.fechaNacimiento) {
      fechaNacimiento.value = new Date(perfil.fechaNacimiento).toISOString().split("T")[0];
    }
    if (perfil.nombre) nombre.value = perfil.nombre;
    if (perfil.email) email.value = perfil.email;
  } catch (e) {
    // Si falla, usar lo que hay en el store
    const fecha = authStore.usuario?.fechaNacimiento;
    if (fecha) {
      fechaNacimiento.value = new Date(fecha).toISOString().split("T")[0];
    }
  }
});

async function handleSave() {
  errors.value = { nombre: "", email: "", fechaNacimiento: "" };

  if (!nombre.value.trim()) {
    errors.value.nombre = "El nombre es obligatorio";
    return;
  }
  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = "Ingresa un correo válido";
    return;
  }
  if (!fechaNacimiento.value) {
    errors.value.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    return;
  }

  const userId = authStore.usuario?.id || authStore.usuario?._id;
  if (!userId) return;

  saving.value = true;
  try {
    await putData(`usuarios/${userId}`, {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      fechaNacimiento: fechaNacimiento.value,
    });

    // Actualizar store
    authStore.setAuth({
      token: authStore.token,
      usuario: {
        ...authStore.usuario,
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        fechaNacimiento: fechaNacimiento.value,
      },
    });

    notify.success("Perfil actualizado exitosamente ✦");
  } catch (error) {
    notify.error(error.response?.data?.msg || error.response?.data?.error || "Error al actualizar perfil");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.user-perfil {
  max-width: 600px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 28px;
}

.page-header__title {
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.page-header__icon {
  color: var(--violet-accent);
}

.page-header__desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

/* Card */
.perfil-card {
  padding: 36px 32px;
}

/* Avatar */
.perfil-avatar {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.perfil-avatar__circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--violet-mid), var(--violet-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  border: 2px solid var(--border-subtle);
  flex-shrink: 0;
}

.perfil-avatar__name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.perfil-avatar__badge {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 20px;
}

.badge--active {
  color: var(--orange-primary);
  background: rgba(232, 132, 42, 0.12);
  border: 1px solid rgba(232, 132, 42, 0.25);
}

.badge--free {
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
}

/* Form */
.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}

/* Readonly fields */
.perfil-readonly {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
  padding: 16px;
  background: rgba(15, 14, 36, 0.5);
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
}

.readonly-field__label {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.readonly-field__value {
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot--active {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.status-dot--inactive {
  background: var(--text-muted);
}

/* Actions */
.perfil-actions {
  margin-bottom: 16px;
}

/* Back */
.perfil-back {
  text-align: center;
  margin-top: 20px;
}

.back-link {
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--orange-primary);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 520px) {
  .perfil-card {
    padding: 28px 20px;
  }

  .perfil-readonly {
    grid-template-columns: 1fr;
  }
}
</style>
