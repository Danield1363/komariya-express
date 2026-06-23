"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Notification } from "@/types";
import { store } from "@/data/store";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [notifs, count] = await Promise.all([
      store.getNotifications(user.id),
      store.getUnreadCount(user.id),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    let cancelled = false;
    const load = async () => {
      const [notifs, count] = await Promise.all([
        store.getNotifications(user.id),
        store.getUnreadCount(user.id),
      ]);
      if (!cancelled) {
        setNotifications(notifs);
        setUnreadCount(count);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, user]);

  const markAsRead = useCallback(async (id: string) => {
    await store.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await store.markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user]);

  const deleteNotificationHandler = useCallback(async (id: string) => {
    await store.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => {
      const deleted = notifications.find((n) => n.id === id);
      return deleted && !deleted.read ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      refresh,
      markAsRead,
      markAllAsRead,
      deleteNotification: deleteNotificationHandler,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
}
