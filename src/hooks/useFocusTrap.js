import { useEffect, useRef } from 'react';

/*
 * useFocusTrap 
 *  1. Al abrir, el foco entra al modal.
 *  2. Tab / Shift+Tab quedan atrapados DENTRO del modal (no se escapan al fondo).
 *  3. Escape cierra.
 *  4. Al cerrar, el foco vuelve al elemento que abrió el modal.
 *
 * Devuelve un ref que debe ponerse en el contenedor del diálogo.
 * `active`: boolean que indica si el modal está abierto.
 * `onClose`: callback para cerrar (se invoca con Escape).
 */
export default function useFocusTrap(active, onClose) {
    const containerRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    useEffect(() => {
        if (!active) return;
        const container = containerRef.current;
        if (!container) return;
        const previouslyFocused = document.activeElement;
        const getFocusable = () =>
            Array.from(
                container.querySelectorAll(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => el.offsetParent !== null);
        const focusables = getFocusable();
        (focusables[0] || container).focus();
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCloseRef.current?.();
                return;
            }
            if (e.key !== 'Tab') return;

            const items = getFocusable();
            if (items.length === 0) {
                e.preventDefault();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const activeEl = document.activeElement;
            if (e.shiftKey) {
                if (activeEl === first || !container.contains(activeEl)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (activeEl === last || !container.contains(activeEl)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };
    }, [active]);

    return containerRef;
}
