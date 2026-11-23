import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

export function EmptyState({
  title = 'No data found',
  description = 'No modules or test cases match your current search and filter criteria.',
  onReset,
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: 'var(--space-48) var(--space-32)',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px dashed var(--color-border-strong)',
      }}
      role="region"
      aria-label="Empty search results"
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: 'var(--space-16)',
        }}
      >
        <AlertCircle size={28} aria-hidden="true" />
      </div>
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: 'var(--space-8)',
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '420px',
          margin: '0 auto var(--space-24)',
        }}
      >
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onReset}
          aria-label="Reset search and filters"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  )
}
