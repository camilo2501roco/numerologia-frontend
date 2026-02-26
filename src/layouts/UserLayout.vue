<template>
  <div class="user-layout">
    <!-- Header -->
    <header class="user-header">
      <div class="user-header__left">
        <router-link :to="isActive ? '/usuario/premium' : '/usuario'" class="user-header__logo">
          <img src="@/assets/icono/logo.svg" alt="Logo" class="user-header__logo-img" />
          <span class="user-header__logo-text">NUMEROLOGÍA</span>
        </router-link>
      </div>

      <div class="user-header__right">
        <!-- Badge de plan -->
        <div class="plan-badge" :class="{ 'plan-badge--active': isActive }">
          <q-icon :name="isActive ? 'star' : 'star_border'" size="14px" />
          <span>{{ isActive ? 'Premium' : 'Plan Gratuito' }}</span>
        </div>

        <!-- Nombre usuario -->
        <div class="user-header__user" @click="showMenu = !showMenu">
          <span class="user-header__name">{{ authStore.nombreUsuario }}</span>
          <div class="user-header__avatar">
            {{ initials }}
          </div>
        </div>

        <!-- Mini menu -->
        <transition name="fade">
          <div v-if="showMenu" class="user-menu">
            <button v-if="!isActive" class="user-menu__item" @click="goTo('/usuario')">
              <q-icon name="dashboard" size="16px" />
              Dashboard
            </button>
            <button v-if="!isActive" class="user-menu__item user-menu__item--premium" @click="goTo('/usuario/membresia')">
              <q-icon name="star" size="16px" />
              Ser Premium
            </button>
            <button v-if="isActive" class="user-menu__item user-menu__item--premium" @click="goTo('/usuario/premium')">
              <q-icon name="star" size="16px" />
              Mi Portal Premium
            </button>
            <button class="user-menu__item" @click="goTo('/usuario/perfil')">
              <q-icon name="person" size="16px" />
              Mi Perfil
            </button>
            <div class="user-menu__divider"></div>
            <button class="user-menu__item user-menu__item--logout" @click="handleLogout">
              <q-icon name="logout" size="16px" />
              Cerrar Sesión
            </button>
          </div>
        </transition>
      </div>
    </header>

    <!-- Contenido -->
    <main class="user-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="user-footer">
      <div class="user-footer__left">
        <img src="@/assets/icono/logo.svg" alt="Logo" class="user-footer__logo" />
        <span>Numerología</span>
      </div>
      <div class="user-footer__center">
        <span>DESTINO</span>
        <span class="footer-dot">•</span>
        <span>ENERGÍA</span>
        <span class="footer-dot">•</span>
        <span>CONEXIÓN</span>
      </div>
      <div class="user-footer__right">
        © Numerología Mística
      </div>
    </footer>

    <!-- Overlay para cerrar menú -->
    <div v-if="showMenu" class="menu-overlay" @click="showMenu = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";

const router = useRouter();
const authStore = useAuthStore();
const showMenu = ref(false);

const isActive = computed(() => authStore.usuario?.estado === "activo");

const initials = computed(() => {
  const name = authStore.nombreUsuario;
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

function goTo(path) {
  showMenu.value = false;
  router.push(path);
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 80%, rgba(232, 132, 42, 0.06) 0%, transparent 50%),
    var(--cosmic-bg);
}

/* ── Header ── */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(10, 8, 28, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.user-header__left {
  display: flex;
  align-items: center;
}

.user-header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.user-header__logo-img {
  width: 22px;
  height: 22px;
  color: var(--violet-accent);
  filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.5));
}

.user-header__logo-text {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--violet-soft);
}

.user-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

/* Plan badge */
.plan-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  padding: 5px 12px;
  border-radius: 20px;
}

.plan-badge--active {
  color: var(--orange-primary);
  background: rgba(232, 132, 42, 0.1);
  border-color: rgba(232, 132, 42, 0.3);
}

/* User */
.user-header__user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 10px;
  transition: background 0.2s;
}

.user-header__user:hover {
  background: rgba(255, 255, 255, 0.04);
}

.user-header__name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-header__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--violet-mid), var(--violet-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  border: 2px solid var(--border-subtle);
}

/* Dropdown menu */
.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--cosmic-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.user-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.82rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.user-menu__item:hover {
  background: rgba(124, 58, 237, 0.1);
  color: var(--text-primary);
}

.user-menu__item--logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.user-menu__item--premium {
  color: var(--orange-primary);
}

.user-menu__item--premium:hover {
  background: rgba(232, 132, 42, 0.1);
  color: var(--orange-light);
}

.user-menu__divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 6px 0;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
}

/* ── Content ── */
.user-content {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
}

/* ── Footer ── */
.user-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.user-footer__left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-footer__logo {
  width: 14px;
  height: 14px;
  color: var(--violet-accent);
}

.user-footer__center {
  display: flex;
  gap: 10px;
}

.footer-dot {
  color: var(--violet-accent);
  opacity: 0.5;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 768px) {
  .user-header {
    padding: 12px 16px;
  }

  .user-header__logo-text {
    display: none;
  }

  .user-header__name {
    display: none;
  }

  .user-content {
    padding: 24px 16px;
  }

  .user-footer {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 16px;
  }

  .user-footer__right {
    display: none;
  }
}
</style>
