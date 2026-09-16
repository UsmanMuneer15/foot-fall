export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type Listener = () => void;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<Listener>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return toasts;
}

export function getServerToasts(): ToastItem[] {
  return [];
}

export function dismissToast(id: number) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function showToast(
  type: ToastType,
  message: string,
  durationMs = 4200,
) {
  const trimmed = message.trim();
  if (!trimmed) return;

  // Replace same-message toasts to avoid stacking / flicker on retries.
  for (const existing of toasts) {
    if (existing.type === type && existing.message === trimmed) {
      dismissToast(existing.id);
    }
  }

  const id = nextId++;
  toasts = [...toasts, { id, type, message: trimmed }];
  emit();

  if (durationMs > 0) {
    const timer = setTimeout(() => dismissToast(id), durationMs);
    timers.set(id, timer);
  }
}

export const toast = {
  success: (message: string, durationMs?: number) =>
    showToast("success", message, durationMs),
  error: (message: string, durationMs?: number) =>
    showToast("error", message, durationMs),
  info: (message: string, durationMs?: number) =>
    showToast("info", message, durationMs),
};
