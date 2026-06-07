export type RobotStatus = "idle" | "moving" | "charging" | "error" | "task";

export interface Robot {
  id: string;
  name: string;
  x: number;
  y: number;
  battery: number;
  status: RobotStatus;
  timestamp: string;
}

export interface FleetSummary {
  total: number;
  idle: number;
  moving: number;
  charging: number;
  error: number;
  task: number;
  avgBattery: number;
  timestamp: string;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";
