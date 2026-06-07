import React from 'react';
import { Bell, Info, Landmark, Check, Star, ShieldAlert, Sparkles, X } from 'lucide-react';
import { NotificationItem } from '../types';
import { cn } from '../utils';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDismissAll: () => void;
  onClose: () => void;
}

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onDismissAll,
  onClose,
}: NotificationsPanelProps) {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      default:
        return <Landmark className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBgColor = (type: NotificationItem['type'], unread: boolean) => {
    if (!unread) return 'bg-white opacity-80';
    switch (type) {
      case 'success':
        return 'bg-emerald-50/50 hover:bg-emerald-50';
      case 'warning':
        return 'bg-amber-50/40 hover:bg-amber-50/70';
      default:
        return 'bg-blue-50/40 hover:bg-blue-50/70';
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-1.5 text-gray-800 font-extrabold text-sm">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span>Financial Alerts & Tips</span>
          {notifications.some(n => n.unread) && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
              {notifications.filter(n => n.unread).length} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onDismissAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No notification updates. Everything is up-to-date!
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-4 transition-all flex gap-3 relative group",
                getBgColor(item.type, item.unread)
              )}
            >
              {/* Type Indicator Icon */}
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-3xs flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              {/* Text Area */}
              <div className="space-y-1 pr-6 flex-1 text-xs">
                <div className="flex items-start justify-between">
                  <h4 className={cn("font-bold text-gray-800", item.unread ? 'font-extrabold' : 'font-semibold')}>
                    {item.title}
                  </h4>
                </div>
                <p className="text-gray-500 leading-relaxed font-semibold text-[11px]">{item.message}</p>
                <span className="text-[9px] text-gray-450 block pt-0.5 font-bold tracking-tight">{item.time}</span>
              </div>

              {/* Clear mark-read action */}
              {item.unread && (
                <button
                  onClick={() => onMarkAsRead(item.id)}
                  className="absolute right-3 top-3 p-1.5 rounded-full bg-white border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 text-gray-400 shadow-3xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
