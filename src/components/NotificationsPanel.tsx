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
    if (!unread) return 'bg-app-card opacity-85';
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5 hover:bg-emerald-500/10';
      case 'warning':
        return 'bg-amber-500/5 hover:bg-amber-500/10';
      default:
        return 'bg-blue-500/5 hover:bg-blue-500/10';
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-app-card border border-app-border rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-bg select-none">
        <div className="flex items-center gap-1.5 text-app-text font-extrabold text-xs tracking-wider uppercase font-sans">
          <Bell className="w-4 h-4 text-app-accent" />
          <span>Financial Alerts & Tips</span>
          {notifications.some(n => n.unread) && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => n.unread).length} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onDismissAll}
              className="text-xs text-app-accent hover:underline font-bold cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-app-text-muted hover:bg-app-bg hover:text-app-text cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-app-border">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-app-text-muted text-xs select-none">
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
              <div className="w-8 h-8 rounded-xl bg-app-card border border-app-border shadow-3xs flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              {/* Text Area */}
              <div className="space-y-1 pr-6 flex-1 text-xs">
                <div className="flex items-start justify-between">
                  <h4 className={cn("text-app-text", item.unread ? 'font-extrabold' : 'font-semibold')}>
                    {item.title}
                  </h4>
                </div>
                <p className="text-app-text-secondary leading-relaxed font-semibold text-[11px]">{item.message}</p>
                <span className="text-[9px] text-app-text-muted block pt-0.5 font-bold tracking-tight">{item.time}</span>
              </div>

              {/* Clear mark-read action */}
              {item.unread && (
                <button
                  onClick={() => onMarkAsRead(item.id)}
                  className="absolute right-3 top-3 p-1.5 rounded-full bg-app-card border border-app-border hover:bg-emerald-500/10 hover:text-emerald-500 text-app-text-muted shadow-3xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
