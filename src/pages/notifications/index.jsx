import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bell,
  AlertTriangle,
  HeartHandshake,
  FileText,
  Phone,
  CheckCheck,
  Loader2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../../hooks/useNotifications";
import { useAuth } from "../../contexts/AuthContext";
import { NOTIFICATION_TYPES } from "../../constants/roles";
import { toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import PageHeader from "../../components/shared/PageHeader";
import LoadingState from "../../components/shared/LoadingState";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";

const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.VIOLATION]: { icon: AlertTriangle, color: "text-danger bg-danger/10" },
  [NOTIFICATION_TYPES.CASE_UPDATE]: { icon: RefreshCw, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/20" },
  [NOTIFICATION_TYPES.LETTER]: { icon: FileText, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20" },
  [NOTIFICATION_TYPES.PARENT_CALL]: { icon: Phone, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20" },
  [NOTIFICATION_TYPES.COACHING]: { icon: HeartHandshake, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20" },
};

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const TYPE_LABELS = {
  [NOTIFICATION_TYPES.VIOLATION]: "Pelanggaran",
  [NOTIFICATION_TYPES.CASE_UPDATE]: "Update Kasus",
  [NOTIFICATION_TYPES.LETTER]: "Surat",
  [NOTIFICATION_TYPES.PARENT_CALL]: "Panggilan Orang Tua",
  [NOTIFICATION_TYPES.COACHING]: "Pembinaan",
};

export default function NotificationsPage() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: notifications, isLoading, error, refetch } = useNotifications(userData?.uid);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const filteredNotifications = showUnreadOnly
    ? (notifications || []).filter((n) => !n.read)
    : notifications || [];

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const handleMarkAsRead = async (notificationId, link) => {
    try {
      await markAsRead.mutateAsync(notificationId);
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync(userData?.uid);
      toast({
        title: "Berhasil",
        description: "Semua notifikasi telah ditandai dibaca",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: err.message || "Gagal menandai semua notifikasi",
      });
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.violationId) return `/violations/${notification.violationId}`;
    if (notification.studentId) {
      if (notification.type === NOTIFICATION_TYPES.LETTER && notification.letterId) {
        return `/letters/${notification.letterId}`;
      }
      if (notification.type === NOTIFICATION_TYPES.CASE_UPDATE) {
        return `/cases/${notification.studentId}`;
      }
      if (notification.type === NOTIFICATION_TYPES.COACHING) {
        return `/coaching`;
      }
      if (notification.type === NOTIFICATION_TYPES.VIOLATION) {
        return `/students/${notification.studentId}`;
      }
    }
    return null;
  };

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div>
      <PageHeader
        title="Notifikasi"
        description={`${unreadCount} notifikasi belum dibaca`}
        actions={
          unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Tandai Semua Dibaca
            </Button>
          )
        }
      />

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(true)}
            className="text-xs"
          >
            Belum Dibaca ({unreadCount})
          </Button>
          <Button
            variant={!showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(false)}
            className="text-xs"
          >
            Semua ({notifications?.length || 0})
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Memuat notifikasi..." />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Tidak ada notifikasi"
          description={showUnreadOnly ? "Semua notifikasi sudah dibaca" : "Belum ada notifikasi untuk ditampilkan"}
        />
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const iconConfig = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS[NOTIFICATION_TYPES.CASE_UPDATE];
            const Icon = iconConfig.icon;
            const link = getNotificationLink(notification);

            return (
              <button
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id, link);
                  } else if (link) {
                    navigate(link);
                  }
                }}
                className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-sm ${
                  notification.read
                    ? "border-border bg-white dark:bg-gray-800"
                    : "border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.05]"
                } ${link ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconConfig.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className={`text-sm ${
                            notification.read
                              ? "text-gray-700 dark:text-gray-300"
                              : "font-semibold text-gray-900 dark:text-white"
                          }`}
                        >
                          {notification.title || TYPE_LABELS[notification.type] || "Notifikasi"}
                        </p>
                        <p
                          className={`text-xs mt-0.5 line-clamp-2 ${
                            notification.read
                              ? "text-gray-500"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {notification.message || "-"}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        {link && (
                          <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      {notification.type && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {TYPE_LABELS[notification.type] || notification.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
