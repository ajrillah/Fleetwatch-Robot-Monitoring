const mqtt = require("mqtt");

// ─── Config ───────────────────────────────────────────────────────────────────
// const BROKER_URL = "mqtt://broker.hivemq.com:1883";
const BROKER_URL = "mqtt://broker.emqx.io:1883";

// const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://test.mosquitto.org:1883";
const TOPIC_PREFIX = "fleetwatch/robots";
const PUBLISH_INTERVAL_MS = 2000;

// ─── Robot Definitions ────────────────────────────────────────────────────────
const ROBOT_STATUSES = ["idle", "moving", "charging", "error", "task"];

const robots = [
  { id: "robot-01", name: "Robot-01", x: 10.0, y: 20.0, battery: 85, status: "idle" },
  { id: "robot-02", name: "Robot-02", x: 35.5, y: 15.2, battery: 62, status: "moving" },
  { id: "robot-03", name: "Robot-03", x: 58.3, y: 40.1, battery: 20, status: "charging" },
  { id: "robot-04", name: "Robot-04", x: 72.0, y: 60.5, battery: 91, status: "task" },
  { id: "robot-05", name: "Robot-05", x: 90.0, y: 80.0, battery: 45, status: "moving" },
];

// ─── Simulation Helpers ───────────────────────────────────────────────────────
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomDelta(range) {
  return (Math.random() - 0.5) * range;
}

function simulateRobot(robot) {
  const updated = { ...robot };

  // Simulate movement
  if (robot.status === "moving" || robot.status === "task") {
    updated.x = clamp(robot.x + randomDelta(4), 0, 100);
    updated.y = clamp(robot.y + randomDelta(4), 0, 100);
  }

  // Simulate battery drain or charge
  if (robot.status === "charging") {
    updated.battery = clamp(robot.battery + 2, 0, 100);
    if (updated.battery >= 100) updated.status = "idle";
  } else {
    updated.battery = clamp(robot.battery - 0.5, 0, 100);
    if (updated.battery <= 10 && robot.status !== "charging") {
      updated.status = "charging";
    }
  }

  // Random status change (low probability)
  if (Math.random() < 0.05 && robot.status !== "charging" && robot.status !== "error") {
    const eligibleStatuses = ROBOT_STATUSES.filter((s) => s !== "charging" && s !== robot.status);
    updated.status = eligibleStatuses[Math.floor(Math.random() * eligibleStatuses.length)];
  }

  // Random error (very low probability)
  if (Math.random() < 0.01) {
    updated.status = "error";
  }

  // Auto-recover from error
  if (robot.status === "error" && Math.random() < 0.2) {
    updated.status = "idle";
  }

  return updated;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`[FleetWatch Simulator] Connecting to ${BROKER_URL}...`);

const client = mqtt.connect(BROKER_URL, {
  clientId: `fleetwatch-simulator-${Date.now()}`,
  clean: true,
  reconnectPeriod: 3000,
});

client.on("connect", () => {
  console.log("[FleetWatch Simulator] Connected to MQTT broker ✓");
  console.log(`[FleetWatch Simulator] Publishing ${robots.length} robots every ${PUBLISH_INTERVAL_MS}ms`);
  console.log(`[FleetWatch Simulator] Topic: ${TOPIC_PREFIX}/+/state\n`);

  setInterval(() => {
    robots.forEach((robot, i) => {
      robots[i] = simulateRobot(robot);

      const payload = JSON.stringify({
        ...robots[i],
        timestamp: new Date().toISOString(),
      });

      const topic = `${TOPIC_PREFIX}/${robot.id}/state`;
      client.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
          console.error(`[ERROR] Failed to publish ${robot.id}:`, err.message);
        }
      });
    });

    // Also publish fleet summary
    const summary = {
      total: robots.length,
      idle: robots.filter((r) => r.status === "idle").length,
      moving: robots.filter((r) => r.status === "moving").length,
      charging: robots.filter((r) => r.status === "charging").length,
      error: robots.filter((r) => r.status === "error").length,
      task: robots.filter((r) => r.status === "task").length,
      avgBattery: Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robots.length),
      timestamp: new Date().toISOString(),
    };

    client.publish(`${TOPIC_PREFIX}/summary`, JSON.stringify(summary), { qos: 1 });
    console.log(`[${new Date().toLocaleTimeString()}] Published fleet update — avg battery: ${summary.avgBattery}%`);
  }, PUBLISH_INTERVAL_MS);
});

client.on("error", (err) => {
  console.error("[FleetWatch Simulator] MQTT error:", err.message);
});

client.on("reconnect", () => {
  console.log("[FleetWatch Simulator] Reconnecting...");
});

process.on("SIGINT", () => {
  console.log("\n[FleetWatch Simulator] Shutting down...");
  client.end();
  process.exit(0);
});
