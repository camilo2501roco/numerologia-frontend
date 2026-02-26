import { Notify } from "quasar";

/**
 * Composable reutilizable de notificaciones.
 * Usa Quasar Notify con el estilo cósmico del proyecto.
 *
 * Uso:
 *   const { success, error, warning, info } = useNotifications()
 *   success('¡Operación exitosa!')
 *   error('Algo salió mal', 'Detalle opcional')
 */
export function useNotifications() {

    const success = (message, caption = '') => {
        Notify.create({
            message,
            caption,
            position: 'top',
            timeout: 3000,
            icon: 'check_circle',
            classes: 'cosmic-notify cosmic-notify--success',
            actions: [{
                icon: 'close',
                color: 'white',
                flat: true,
                round: true
            }],
            html: true
        })
    }

    const error = (message, caption = '') => {
        Notify.create({
            message,
            caption,
            position: 'top',
            timeout: 4000,
            icon: 'error',
            classes: 'cosmic-notify cosmic-notify--error',
            actions: [{
                icon: 'close',
                color: 'white',
                flat: true,
                round: true
            }],
            html: true
        })
    }

    const warning = (message, caption = '') => {
        Notify.create({
            message,
            caption,
            position: 'top',
            timeout: 3500,
            icon: 'warning',
            classes: 'cosmic-notify cosmic-notify--warning',
            actions: [{
                icon: 'close',
                color: 'white',
                flat: true,
                round: true
            }],
            html: true
        })
    }

    const info = (message, caption = '') => {
        Notify.create({
            message,
            caption,
            position: 'top',
            timeout: 3000,
            icon: 'auto_awesome',
            classes: 'cosmic-notify cosmic-notify--info',
            actions: [{
                icon: 'close',
                color: 'white',
                flat: true,
                round: true
            }],
            html: true
        })
    }

    return { success, error, warning, info }
}
