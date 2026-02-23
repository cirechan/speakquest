"use client";

import { useNotificationStore } from "@/stores/notification-store";
import { Toast } from "@/components/ui/Toast";

export function NotificationLayer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          xpAmount={notification.xpAmount}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
