import { useEffect, useRef, useState, useCallback } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";
import type { Robot, FleetSummary, ConnectionStatus } from "../types";

const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";
const TOPIC_PREFIX = "fleetwatch/robots";

export function useMqttFleet() {
  const [robots, setRobots] = useState<Map<string, Robot>>(new Map());
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  const createClient = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end(true);
    }

    const client = mqtt.connect(BROKER_URL, {
      clientId: `fleetwatch-dashboard-${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
    });

    client.on("connect", () => {
      setConnectionStatus("connected");
      client.subscribe(`${TOPIC_PREFIX}/+/state`, { qos: 1 });
      client.subscribe(`${TOPIC_PREFIX}/summary`, { qos: 1 });
    });

    client.on("message", (topic: string, payload: Buffer) => {
      try {
        const data = JSON.parse(payload.toString());
        setLastUpdated(new Date());
        if (topic.endsWith("/summary")) {
          setSummary(data as FleetSummary);
        } else {
          const robot = data as Robot;
          setRobots((prev) => {
            const next = new Map(prev);
            next.set(robot.id, robot);
            return next;
          });
        }
      } catch {
        // ignore malformed messages
      }
    });

    client.on("error", () => setConnectionStatus("error"));
    client.on("offline", () => setConnectionStatus("disconnected"));
    client.on("reconnect", () => setConnectionStatus("connecting"));

    clientRef.current = client;
  }, []);

  const connect = useCallback(() => {
    setConnectionStatus("connecting");
    createClient();
  }, [createClient]);

  useEffect(() => {
    createClient();
    return () => {
      clientRef.current?.end(true);
    };
  }, [createClient]);

  return {
    robots: Array.from(robots.values()),
    summary,
    connectionStatus,
    lastUpdated,
    reconnect: connect,
  };
}