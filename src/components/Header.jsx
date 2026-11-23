import React from 'react'
import {
  ShieldAlert,
  Wifi,
  Activity,
  PlusCircle,
  FileCheck,
  Cpu,
  Layers,
} from 'lucide-react'

export function Header({
  activeTab,
  onTabChange,
  freezeStatus,
  slowNetwork,
  onToggleSlowNetwork,
  onOpenModal,
  telemetryCount,
  onOpenTelemetry,
}) {
  const tabs = [
    { id: 'overview', label: 'Freeze Gate & Status', icon: Layers },
    { id: 'scanner', label: 'AI Injection Scanner', icon: Cpu },
    { id: 'registry', label: 'Structured Registry', icon: FileCheck },
  ]

  return (
    <header
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top Banner: Corporate System Bar */}
      <div
        style={{
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-subtle)',
          padding: 'var(--space-8) var(--space-16)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <span
              className="badge badge-dark"
              style={{ fontSize: '0.6875rem' }}
            >
              Enterprise Release Guard
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Policy: Q4 Enterprise Production Lock &bull; Status:{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>
                {freezeStatus.replace('_', ' ')}
              </strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            {/* Simulated Slow 3G Network Toggle */}
            <button
              type="button"
              onClick={onToggleSlowNetwork}
              className="btn btn-secondary"
              style={{
                minHeight: '28px',
                padding: 'var(--space-4) var(--space-8)',
                fontSize: '0.75rem',
              }}
              aria-pressed={slowNetwork}
              aria-label={`Toggle Slow 3G Simulation. Currently ${slowNetwork ? 'Enabled' : 'Disabled'}`}
            >
              <Wifi size={14} aria-hidden="true" />
              <span>
                Slow 3G Simulation: {slowNetwork ? 'ACTIVE (1.5s)' : 'OFF'}
              </span>
            </button>

            {/* Live Telemetry Ping Button */}
            <button
              type="button"
              onClick={onOpenTelemetry}
              className="btn btn-secondary"
              style={{
                minHeight: '28px',
                padding: 'var(--space-4) var(--space-8)',
                fontSize: '0.75rem',
              }}
              aria-label={`View telemetry logs. Total events: ${telemetryCount}`}
            >
              <Activity size={14} aria-hidden="true" />
              <span>Telemetry Pings ({telemetryCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation & Title */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'var(--space-16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-btn-primary-bg)',
              color: 'var(--color-btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Code Freeze: AI Injection
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Capstone 4 Final Polish &bull; Corporate Governance &amp; Adversarial Security
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenModal}
            aria-label="Submit new AI Injection test payload or freeze bypass exception"
          >
            <PlusCircle size={16} aria-hidden="true" />
            <span>New Injection Test / Exception</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <nav
        aria-label="Primary Navigation"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 var(--space-16)',
          display: 'flex',
          gap: 'var(--space-8)',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                padding: 'var(--space-12) var(--space-16)',
                minHeight: '44px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--color-text-primary)' : '3px solid transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
