import client from "prom-client";

export const register = new client.Registry();

// Safe global flag
const g = globalThis as unknown as { metricsInitialized?: boolean };

if (!g.metricsInitialized) {
  client.collectDefaultMetrics({ register });
  g.metricsInitialized = true;
}