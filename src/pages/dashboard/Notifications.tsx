import { useState } from "react";

type NotificationType = "alert" | "info" | "success" | "warning";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "alert",
    title: "Demurrage charge incoming",
    body: "Container HLCU4521037 has exceeded free time at Hamburg terminal. Charges begin accruing in 24 hours.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Vessel delay — MSC DIANA",
    body: "MSC DIANA has been delayed by 18 hours at Suez Canal transit. ETA updated to Mar 25, 2026.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "success",
    title: "Customs cleared — CMAU1983204",
    body: "Container CMAU1983204 has cleared customs at Felixstowe. Ready for pickup within 2 business days.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n4",
    type: "info",
    title: "Document request",
    body: "Rotterdam port authority has requested an updated Bill of Lading for shipment MSKU7234891.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "success",
    title: "Approval granted — APR-2026-039",
    body: "Your route amendment request for CMAU1983204 has been approved. Vessel will now transit via Tanjung Pelepas.",
    time: "Mar 15, 2026",
    read: true,
  },
  {
    id: "n6",
    type: "alert",
    title: "Overweight flag — MAEU9043156",
    body: "VGM discrepancy detected on MAEU9043156. Please resubmit verified gross mass within 48 hours to avoid cargo hold.",
    time: "Mar 13, 2026",
    read: true,
  },
  {
    id: "n7",
    type: "info",
    title: "New report available",
    body: "Your monthly shipment report for February 2026 is ready. Download it from the Reports section.",
    time: "Mar 1, 2026",
    read: true,
  },
];

const typeConfig: Record<NotificationType, { dot: string; bg: string }> = {
  alert: { dot: "bg-red-500", bg: "bg-red-50" },
  warning: { dot: "bg-amber-500", bg: "bg-amber-50" },
  success: { dot: "bg-green-500", bg: "bg-green-50" },
  info: { dot: "bg-[#052698]", bg: "bg-[#052698]/5" },
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#052698] text-xl font-heading font-bold tracking-tight">Notifications</h2>
          <p className="text-[#545454]/70 text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[#052698] border border-[#052698]/25 px-4 py-2 hover:bg-[#052698]/5 transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`border border-[#052698]/15 p-4 flex gap-3 cursor-pointer transition-colors ${
              !n.read ? "bg-[#FFF9F5]" : "bg-transparent opacity-70"
            }`}
          >
            {/* Type indicator */}
            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${typeConfig[n.type].dot}`} />
              {!n.read && <span className="w-0.5 flex-1 bg-[#052698]/10" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-medium leading-tight ${!n.read ? "text-[#052698]" : "text-[#545454]"}`}>
                  {n.title}
                </p>
                <span className="text-[10px] text-[#545454]/50 shrink-0 mt-0.5">{n.time}</span>
              </div>
              <p className="text-xs text-[#545454]/70 mt-1 leading-relaxed">{n.body}</p>

              {!n.read && (
                <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 ${typeConfig[n.type].bg} text-[#545454]/70`}>
                  Unread
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
