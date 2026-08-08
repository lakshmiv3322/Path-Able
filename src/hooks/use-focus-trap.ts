import { useEffect, useRef } from 'react';

/**
 * Traps keyboard focus inside `containerRef` while `active` is true.
 * On activation, focuses the first focusable element (or `initialRef` if provided).
 * On deactivation, returns focus to `returnRef` if provided.
 *
 * Handles Tab / Shift+Tab cycling and Escape (via `onEscape`).
 */
export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement>,
  opts: {
    initialRef?: React.RefObject<HTMLElement>;
    returnRef?: React.RefObject<HTMLElement>;
    onEscape?: () => void;
  } = {},
) {
  const { initialRef, returnRef, onEscape } = opts;
  const savedFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    savedFocus.current = document.activeElement as HTMLElement;

    // focus initial or first focusable
    const focusables = () => getFocusables(container);
    const target = initialRef?.current ?? focusables()[0];
    if (target) target.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !container.contains(document.activeElement)) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    container.addEventListener('keydown', onKey);
    return () => {
      container.removeEventListener('keydown', onKey);
      if (returnRef?.current) {
        returnRef.current.focus({ preventScroll: true });
      } else if (savedFocus.current) {
        savedFocus.current.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, initialRef, returnRef, onEscape]);
}

function getFocusables(el: HTMLElement): HTMLElement[] {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';
  return Array.from(el.querySelectorAll<HTMLElement>(sel)).filter((n) => n.offsetParent !== null || n === document.activeElement);
}
