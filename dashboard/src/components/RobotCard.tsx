import type { Robot } from "../types";
import {
  Battery,
  BatteryCharging,
  BatteryWarning,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Wrench,
} from "lucide-react";

interface RobotCardProps {
  robot: Robot;
}

const STATUS_CONFIG = {
  idle: {
    label: "Idle",
    color: "var(--status-idle)",
    bg: "var(--status-idle-bg)",
    Icon: CheckCircle2,
  },
  moving: {
    label: "Moving",
    color: "var(--status-moving)",
    bg: "var(--status-moving-bg)",
    Icon: Loader2,
  },
  charging: {
    label: "Charging",
    color: "var(--status-charging)",
    bg: "var(--status-charging-bg)",
    Icon: BatteryCharging,
  },
  error: {
    label: "Error",
    color: "var(--status-error)",
    bg: "var(--status-error-bg)",
    Icon: AlertTriangle,
  },
  task: {
    label: "On Task",
    color: "var(--status-task)",
    bg: "var(--status-task-bg)",
    Icon: Wrench,
  },
};

function BatteryIcon({ level }: { level: number }) {
  if (level <= 15) return <BatteryWarning size={14} style={{ color: "var(--status-error)" }} />;
  if (level <= 30) return <Battery size={14} style={{ color: "var(--status-charging)" }} />;
  return <Battery size={14} style={{ color: "var(--status-idle)" }} />;
}

export function RobotCard({ robot }: RobotCardProps) {
  const config = STATUS_CONFIG[robot.status];
  const { Icon } = config;
  const isMoving = robot.status === "moving";
  const isError = robot.status === "error";

  return (
    <div className={`robot-card ${isError ? "robot-card--error" : ""}`}>
      <div className="robot-card__header">
        <div className="robot-card__id">
          <span className="robot-dot" style={{ background: config.color }} />
          <span className="robot-name">{robot.name}</span>
        </div>
        <div
          className="robot-status-badge"
          style={{ color: config.color, background: config.bg }}
        >
          <Icon size={12} className={isMoving ? "spin" : ""} />
          {config.label}
        </div>
      </div>

      <div className="robot-card__battery">
        <div className="battery-label">
          <BatteryIcon level={robot.battery} />
          <span>{Math.round(robot.battery)}%</span>
        </div>
        <div className="battery-track">
          <div
            className="battery-fill"
            style={{
              width: `${robot.battery}%`,
              background:
                robot.battery <= 15
                  ? "var(--status-error)"
                  : robot.battery <= 30
                  ? "var(--status-charging)"
                  : "var(--status-idle)",
            }}
          />
        </div>
      </div>

      <div className="robot-card__position">
        <MapPin size={12} />
        <span>
          ({robot.x.toFixed(1)}, {robot.y.toFixed(1)})
        </span>
      </div>

      <div className="robot-card__time">
        {new Date(robot.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
