import type { Robot } from "../types";

interface FleetMapProps {
  robots: Robot[];
}

const STATUS_COLORS: Record<string, string> = {
  idle: "var(--status-idle)",
  moving: "var(--status-moving)",
  charging: "var(--status-charging)",
  error: "var(--status-error)",
  task: "var(--status-task)",
};

export function FleetMap({ robots }: FleetMapProps) {
  return (
    <div className="fleet-map">
      <div className="fleet-map__header">
        <span>Map</span>
        <span className="fleet-map__subtitle">{robots.length} robots tracked</span>
      </div>
      <div className="fleet-map__canvas">
        {/* Grid lines */}
        {[20, 40, 60, 80].map((v) => (
          <div key={`h-${v}`} className="grid-line grid-line--h" style={{ top: `${v}%` }} />
        ))}
        {[20, 40, 60, 80].map((v) => (
          <div key={`v-${v}`} className="grid-line grid-line--v" style={{ left: `${v}%` }} />
        ))}

        {/* Robot dots */}
        {robots.map((robot) => (
          <div
            key={robot.id}
            className={`map-robot ${robot.status === "moving" ? "map-robot--moving" : ""} ${robot.status === "error" ? "map-robot--error" : ""
              }`}
            style={{
              left: `${robot.x}%`,
              top: `${robot.y}%`,
              "--robot-color": STATUS_COLORS[robot.status],
            } as React.CSSProperties}
            title={`${robot.name} — ${robot.status} (${robot.x.toFixed(1)}, ${robot.y.toFixed(1)})`}
          >
            <span className="map-robot__label">{robot.name.replace("Robot-", "R")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
