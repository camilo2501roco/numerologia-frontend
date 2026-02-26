import { ref, computed } from "vue";

/**
 * Composable para validación de formularios de autenticación
 * Proporciona validadores reutilizables para login y registro
 */
export function useAuthForm() {
    // ═══ Estado de errores ═══
    const errors = ref({});

    // ═══ Validadores individuales ═══

    function validateEmail(email) {
        if (!email || !email.trim()) {
            return "Este campo es obligatorio";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return "Formato de correo inválido";
        }
        return "";
    }

    function validatePassword(password) {
        if (!password) {
            return "Este campo es obligatorio";
        }
        if (password.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
        return "";
    }

    function validateName(name) {
        if (!name || !name.trim()) {
            return "Este campo es obligatorio";
        }
        if (name.trim().length < 3) {
            return "El nombre debe tener al menos 3 caracteres";
        }
        return "";
    }

    function validateBirthDate(date) {
        if (!date) {
            return "Este campo es obligatorio";
        }
        const birthDate = new Date(date);
        const today = new Date();
        if (isNaN(birthDate.getTime())) {
            return "Fecha inválida";
        }
        if (birthDate >= today) {
            return "Fecha inválida. Ingresa una fecha pasada";
        }
        return "";
    }

    // ═══ Validar formulario de Login ═══
    function validateLogin(email, password) {
        const newErrors = {};
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    // ═══ Validar formulario de Registro ═══
    function validateRegister(nombre, email, password, fechaNacimiento) {
        const newErrors = {};
        const nameError = validateName(nombre);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const dateError = validateBirthDate(fechaNacimiento);

        if (nameError) newErrors.nombre = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        if (dateError) newErrors.fechaNacimiento = dateError;

        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    // ═══ Limpiar errores ═══
    function clearErrors() {
        errors.value = {};
    }

    function clearError(field) {
        const newErrors = { ...errors.value };
        delete newErrors[field];
        errors.value = newErrors;
    }

    // ═══ Helpers ═══
    const hasErrors = computed(() => Object.keys(errors.value).length > 0);

    return {
        errors,
        hasErrors,
        validateEmail,
        validatePassword,
        validateName,
        validateBirthDate,
        validateLogin,
        validateRegister,
        clearErrors,
        clearError,
    };
}
