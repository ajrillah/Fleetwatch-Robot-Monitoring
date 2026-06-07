# FleetWatch

Real-time robot fleet monitoring dashboard built with **React**, **TypeScript**, **MQTT**, and **WebSocket**.

![CI/CD](https://github.com/ajrillah/fleetwatch/actions/workflows/ci-cd.yml/badge.svg)

## Overview

FleetWatch is a fullstack project that demonstrates real-time data streaming for robot fleet management. It uses the MQTT protocol (over WebSocket) to stream live telemetry data — battery levels, positions, and statuses — from a Node.js simulator to a React dashboard.

```
[Node.js Simulator]
      │
      ▼  MQTT publish (TCP)
[HiveMQ Public Broker]
      │
      ▼  MQTT over WebSocket (WSS)
[React + TypeScript Dashboard]
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Realtime | MQTT over WebSocket (`mqtt.js`) |
| Broker | HiveMQ Public Broker |
| Simulator | Node.js, `mqtt` package |
| CI/CD | GitHub Actions → GitHub Pages |

## Project Structure

```
fleetwatch/
├── dashboard/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # RobotCard, FleetMap, StatCard, ConnectionBadge
│   │   ├── hooks/      # useMqttFleet (MQTT subscription logic)
│   │   └── types/      # TypeScript interfaces
│   └── package.json
├── simulator/          # Node.js MQTT data publisher
│   └── src/index.js
└── .github/
    └── workflows/
        └── ci-cd.yml   # Lint → Build → Deploy pipeline
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Run the Simulator

```bash
cd simulator
npm install
npm start
```

The simulator publishes robot telemetry to `fleetwatch/robots/+/state` and a fleet summary to `fleetwatch/robots/summary` every 2 seconds.

### Run the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run Both Together (from root)

```bash
npm install
npm run dev
```

## MQTT Topics

| Topic | Description |
|-------|-------------|
| `fleetwatch/robots/{id}/state` | Individual robot telemetry |
| `fleetwatch/robots/summary` | Fleet-wide summary stats |

### Robot State Payload

```json
{
  "id": "robot-01",
  "name": "Robot-01",
  "x": 42.3,
  "y": 18.7,
  "battery": 78.5,
  "status": "moving",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Robot Statuses

| Status | Description |
|--------|-------------|
| `idle` | Robot is stationary, waiting for task |
| `moving` | Robot is navigating to a destination |
| `task` | Robot is executing an assigned task |
| `charging` | Robot is docked and charging |
| `error` | Robot has encountered an error |

## CI/CD Pipeline

GitHub Actions runs on every push to `main` or `develop`:

1. **Lint & Type Check** — ESLint + TypeScript compiler check
2. **Build** — Vite production build, artifact uploaded
3. **Deploy** *(main only)* — Deploy to GitHub Pages

## Relevance to Robotics / AMR Systems

This project mirrors patterns used in real AMR (Autonomous Mobile Robot) fleet management systems:

- **MQTT** is the de facto IoT/robotics messaging protocol (also used in ROS bridges)
- **WebSocket transport** enables browser-based monitoring without polling
- **Real-time fleet state** mirrors Open-RMF fleet adapter patterns
- **Status/battery telemetry** reflects standard AMR data models

## License

MIT
