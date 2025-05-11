import { v4 as uuidv4 } from 'uuid';
import type { Notification } from '../types/student';

const NOTIFICATIONS_KEY = 'student_notifications';

export function createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    read: false
  };
  
  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  return newNotification;
}

export function getNotifications(): Notification[] {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getStudentNotifications(studentId: string): Notification[] {
  return getNotifications()
    .filter(notification => notification.studentId === studentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
}