import { Bell, FileCheck, Megaphone } from 'lucide-react';
import type { Notification } from '../../types/student';
import { markNotificationAsRead } from '../../utils/notifications';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationRead?: (id: string) => void;
}

export function NotificationList({ notifications, onNotificationRead }: NotificationListProps) {
  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    onNotificationRead?.(id);
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-8 w-8 mx-auto mb-2" />
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className={`p-4 rounded-lg border ${
              notification.read ? 'bg-gray-50' : 'bg-white border-indigo-100'
            } cursor-pointer hover:bg-gray-50 transition-colors`}
          >
            <div className="flex items-start space-x-3">
              {notification.type === 'CERTIFICATE' ? (
                <FileCheck className="h-5 w-5 text-indigo-500 mt-1" />
              ) : (
                <Megaphone className="h-5 w-5 text-indigo-500 mt-1" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {notification.title}
                </h4>
                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!notification.read && (
                <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}