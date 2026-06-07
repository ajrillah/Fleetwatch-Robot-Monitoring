import { Wifi, WifiOff, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { ConnectionStatus } from "../types";

interface ConnectionBadgeProps {
  status: ConnectionStatus;
  lastUpdated: Date | null;
  onReconnect: () => void;
}

const CONFIG = {
  connecting: { label: "Connecting...", Icon: Loader2, color: "var(--status-charging)", spin: true },
  connected: { label: "Live", Icon: Wifi, color: "var(--status-idle)", spin: false },
  disconnected: { label: "Disconnected", Icon: WifiOff, color: "var(--muted)", spin: false },
  error: { label: "Error", Icon: AlertCircle, color: "var(--status-error)", spin: false },
};

export function ConnectionBadge({ status, lastUpdated, onReconnect }: ConnectionBadgeProps) {
  const { label, Icon, color, spin } = CONFIG[status];

  return (
    <div className="connection-badge">
      <div className="connection-badge__status" style={{ color }}>
        <Icon size={14} className={spin ? "spin" : ""} />
        <span>{label}</span>
        {status === "connected" && <span className="live-dot" />}
      </div>
      {lastUpdated && (
        <span className="connection-badge__time">
          Updated {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      {(status === "disconnected" || status === "error") && (
        <button className="reconnect-btn" onClick={onReconnect}>
          <RefreshCw size={12} />
          Reconnect
        </button>
      )}
    </div>
  );
}
