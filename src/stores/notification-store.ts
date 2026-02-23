import { create } from "zustand";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "xp";
  message: string;
  xpAmount?: number;
  duration?: number;
}

interface NotificationStoreState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  addXP: (amount: number, reason: string) => void;
}

let idCounter = 0;

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notif-${++idCounter}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  addXP: (amount, reason) => {
    const id = `xp-${++idCounter}`;
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, type: "xp", message: reason, xpAmount: amount, duration: 2500 },
      ],
    }));
  },
}));
