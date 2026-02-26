<template>
  <div class="auth-header">
    <!-- Ícono estrella animado -->
    <div class="auth-header__icon animate-float">
      <img src="@/assets/icono/logo.svg" alt="Logo" class="logo-icon" />
    </div>

    <!-- Título -->
    <h1 class="auth-header__title">
      {{ title }}
      <span class="auth-header__highlight">{{ highlight }}</span>
    </h1>

    <!-- Subtítulo -->
    <p v-if="subtitle" class="auth-header__subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "PORTAL" },
  highlight: { type: String, default: "ASTRAL" },
  subtitle: { type: String, default: "" },
});
</script>

<style scoped>
.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

/* Ícono estrella */
.auth-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--violet-accent), var(--violet-mid));
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.4);
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: var(--violet-soft);
  filter: drop-shadow(0 0 4px rgba(192, 132, 252, 0.6));
}

/* Título */
.auth-header__title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 0.2em;
  line-height: 1.3;
  margin: 0;
}

.auth-header__highlight {
  font-family: var(--font-display);
  font-weight: 900;
  color: var(--orange-primary);
}

/* Subtítulo */
.auth-header__subtitle {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--text-gold);
  margin-top: 8px;
  letter-spacing: 0.03em;
}

/* Responsive */
@media (max-width: 520px) {
  .auth-header__title {
    font-size: 1.6rem;
  }
}
</style>
