/**
 * Enterprise Telemetry Simulation System
 *
 * Specific TRD Requirement:
 * Log a specific message to the console:
 *   [Analytics] User interacted with Code Freeze: AI Injection
 * whenever a primary action is completed.
 */

// In-memory telemetry log store for UI audit inspection
const telemetryEvents = []
const subscribers = new Set()

export function logTelemetry(actionName, metadata = {}) {
  const timestamp = new Date().toISOString()

  // 1. Exact mandatory console message specified in TRD
  console.log('[Analytics] User interacted with Code Freeze: AI Injection', {
    action: actionName,
    timestamp,
    ...metadata,
  })

  // 2. Record event in telemetry state store
  const event = {
    id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action: actionName,
    message: '[Analytics] User interacted with Code Freeze: AI Injection',
    timestamp,
    metadata,
  }

  telemetryEvents.unshift(event)
  if (telemetryEvents.length > 50) {
    telemetryEvents.pop()
  }

  subscribers.forEach((callback) => {
    try {
      callback([...telemetryEvents])
    } catch {
      // safe fallback
    }
  })

  return event
}

export function subscribeTelemetry(callback) {
  subscribers.add(callback)
  callback([...telemetryEvents])
  return () => {
    subscribers.delete(callback)
  }
}

export function getTelemetryHistory() {
  return [...telemetryEvents]
}
