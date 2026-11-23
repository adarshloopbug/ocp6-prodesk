import React from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingIndicator({
  message = 'Processing request...',
  isOverlay = false,
}) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-12)',
        padding: 'var(--space-32)',
        color: 'var(--color-text-primary)',
      }}
    >
      <Loader2
        size={36}
        className="animate-spin"
        aria-hidden="true"
        style={{ strokeWidth: 2 }}
      />
      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        Preserving security state and telemetry integrity
      </span>
    </div>
  )

  if (isOverlay) {
    return (
      <div
        className="modal-overlay"
        style={{ zIndex: 2000 }}
        aria-busy="true"
        aria-modal="true"
      >
        <div
          className="card"
          style={{
            margin: 0,
            maxWidth: '360px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  return content
}
