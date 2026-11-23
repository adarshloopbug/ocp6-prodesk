import React from 'react'
import { X, Activity, Trash2 } from 'lucide-react'

export function TelemetryDrawer({ isOpen, onClose, events, onClear }) {
  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      style={{
        justifyContent: 'flex-end',
        padding: 0,
        backgroundColor: 'rgba(9, 9, 11, 0.5)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="telemetry-drawer-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100vh',
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-strong)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: 'var(--space-16) var(--space-24)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <Activity size={20} aria-hidden="true" />
            <h2 id="telemetry-drawer-title" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              Live Telemetry Simulation Log
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ minHeight: '36px', padding: 'var(--space-4) var(--space-8)' }}
            onClick={onClose}
            aria-label="Close telemetry log drawer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Banner */}
        <div
          style={{
            padding: 'var(--space-12) var(--space-24)',
            backgroundColor: 'var(--color-bg-subtle)',
            borderBottom: '1px solid var(--color-border-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          Logging console pattern:
          <code
            style={{
              display: 'block',
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4) var(--space-8)',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            [Analytics] User interacted with Code Freeze: AI Injection
          </code>
        </div>

        {/* Event List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-16) var(--space-24)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-12)',
          }}
          tabIndex={0}
          aria-label="List of telemetry events"
        >
          {events.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-48) 0',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
              }}
            >
              No telemetry events recorded yet. Perform an action (scan prompt, toggle freeze, submit module) to emit analytics pings.
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: 'var(--space-12)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  fontSize: '0.8125rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <span className="badge badge-dark" style={{ fontSize: '0.6875rem' }}>
                    {ev.action}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-4)',
                    wordBreak: 'break-all',
                  }}
                >
                  {ev.message}
                </div>
                {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                  <pre
                    style={{
                      margin: 0,
                      marginTop: 'var(--space-4)',
                      padding: 'var(--space-8)',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.6875rem',
                      fontFamily: 'var(--font-mono)',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(ev.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: 'var(--space-16) var(--space-24)',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {events.length} telemetry records stored in memory
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ minHeight: '32px', padding: 'var(--space-4) var(--space-8)', fontSize: '0.75rem' }}
            onClick={onClear}
            disabled={events.length === 0}
            aria-label="Clear telemetry event history"
          >
            <Trash2 size={14} aria-hidden="true" />
            <span>Clear Events</span>
          </button>
        </div>
      </div>
    </div>
  )
}
