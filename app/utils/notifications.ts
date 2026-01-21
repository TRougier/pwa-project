export type SimpleNotification = {
  id: string;
  text: string;
  createdAt: number;
};

const KEY = "notifications_simple";

function uid() {
  // fallback si randomUUID pas dispo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = crypto;
  return c?.randomUUID ? c.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getNotifications(): SimpleNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addNotification(text: string) {
  if (typeof window === "undefined") return;

  const notif: SimpleNotification = {
    id: uid(),
    text,
    createdAt: Date.now(),
  };

  const all = getNotifications();
  const next = [notif, ...all].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));

  window.dispatchEvent(new Event("notifications-updated"));
}

export function clearNotifications() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("notifications-updated"));
}
