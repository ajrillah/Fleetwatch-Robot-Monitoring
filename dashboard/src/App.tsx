import { useMqttFleet } from "./hooks/useMqttFleet";
import { RobotCard } from "./components/RobotCard";
import { FleetMap } from "./components/FleetMap";
import { StatCard } from "./components/StatCard";
import { ConnectionBadge } from "./components/ConnectionBadge";
import {
  Bot
} from "lucide-react";
import "./App.css";

function App() {
  const { robots, summary, connectionStatus, lastUpdated, reconnect } = useMqttFleet();

  const errorCount = robots.filter((r) => r.status === "error").length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          {/* <div className="brand-icon">
            <Bot size={20} />
          </div> */}
          <div>
            <h1 className="brand-title">Robot Monitoring</h1>
          </div>
        </div>
        <ConnectionBadge
          status={connectionStatus}
          lastUpdated={lastUpdated}
          onReconnect={reconnect}
        />
      </header>

      <main className="app-main">
        {summary && (
          <section className="stats-row">
            <StatCard label="Total Robots" value={summary.total} color="var(--accent)" />
            <StatCard label="Active" value={summary.moving + summary.task} color="var(--status-moving)" />
            <StatCard label="Avg Battery" value={summary.avgBattery} suffix="%" color={summary.avgBattery < 30 ? "var(--status-error)" : "var(--status-idle)"} />
            <StatCard label="Charging" value={summary.charging} color="var(--status-charging)" />
            <StatCard label="On Task" value={summary.task} color="var(--status-task)" />
            <StatCard label="Errors" value={summary.error} color={errorCount > 0 ? "var(--status-error)" : "var(--muted)"} />
          </section>
        )}

        <section className="content-grid">
          <FleetMap robots={robots} />
          <div className="robots-panel">
            <div className="robots-panel__header">
              <span>Robot Status</span>
              <span className="robots-panel__count">{robots.length} units</span>
            </div>
            {robots.length === 0 ? (
              <div className="empty-state">
                <Bot size={32} />
                <p>Waiting for robot data...</p>
                <p className="empty-state__sub">Make sure the simulator is running</p>
              </div>
            ) : (
              <div className="robots-grid">
                {robots.map((robot) => (
                  <RobotCard key={robot.id} robot={robot} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
      </footer>
    </div>
  );
}

export default App;
