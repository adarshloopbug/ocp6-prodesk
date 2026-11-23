import React, { useState } from 'react'
import {
  Lock,
  Unlock,
  AlertTriangle,
  ShieldCheck,
  FileCode,
  ArrowRight,
} from 'lucide-react'

export function FreezeOverview({
  freezeState,
  onUpdateFreezeState,
  onNavigateToScanner,
  onNavigateToRegistry,
  isLoading,
}) {
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverrideInput, setShowOverrideInput] = useState(false)
  const [overrideError, setOverrideError] = useState(false)

  const handleToggleFreeze = (newStatus) => {
    if (newStatus === 'EMERGENCY_OVERRIDE') {
      if (!overrideReason.trim()) {
        setOverrideError(true)
        return
      }
    }
    setOverrideError(false)
    onUpdateFreezeState(newStatus, overrideReason.trim() || undefined)
    setShowOverrideInput(false)
    setOverrideReason('')
  }

  const isFrozen = freezeState.status === 'ACTIVE_FREEZE'
  const isOverride = freezeState.status === 'EMERGENCY_OVERRIDE'

  return (
    <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
      {/* Policy Banner Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
              <span className="badge badge-dark">Executive Policy Enforcement</span>
              <span className="badge">WCAG 2.1 AAA Compliant</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {freezeState.policyName}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-16)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {isFrozen && <Lock size={16} aria-hidden="true" />}
              {isOverride && <AlertTriangle size={16} aria-hidden="true" />}
              {!isFrozen && !isOverride && <Unlock size={16} aria-hidden="true" />}
              <span>{freezeState.status.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)', fontSize: '0.9375rem' }}>
          During an active Code Freeze window, all automated production deployments, direct merges into
          protected release branches, and uninspected AI model endpoints are locked. Changes require verified
          AI Injection vulnerability scanning and manager sign-off.
        </p>

        {/* 4 Corporate KPI Blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-32)',
          }}
        >
          <div
            style={{
              padding: 'var(--space-16)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Protected Modules
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-4)' }}>
              {freezeState.frozenModules} / {freezeState.totalModules}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Production lockdown active
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-16)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Emergency Overrides
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-4)' }}>
              {freezeState.emergencyOverridesCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Audited by Governance Board
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-16)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              AI Injection Security Gate
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-4)' }}>
              100% Passed
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Zero unverified prompts
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-16)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Enforcement Window
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: 'var(--space-4)' }}>
              Nov 20 - Dec 05
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Nexus Governance Board
            </div>
          </div>
        </div>

        {/* Governance Controls Bar */}
        <div
          style={{
            padding: 'var(--space-16)',
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 'var(--space-8)' }}>
            Manager Governance Actions:
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {isFrozen ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleToggleFreeze('THAWED')}
                disabled={isLoading}
                aria-label="Thaw code freeze: lift deployment lockdown"
              >
                <Unlock size={16} aria-hidden="true" />
                <span>Thaw Freeze Window (Lift Lockdown)</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleToggleFreeze('ACTIVE_FREEZE')}
                disabled={isLoading}
                aria-label="Enforce active code freeze"
              >
                <Lock size={16} aria-hidden="true" />
                <span>Enforce Active Code Freeze</span>
              </button>
            )}

            {!showOverrideInput ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowOverrideInput(true)}
                disabled={isLoading}
                aria-label="Request emergency hotfix override"
              >
                <AlertTriangle size={16} aria-hidden="true" />
                <span>Request Emergency Hotfix Override</span>
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-8)',
                  flexWrap: 'wrap',
                  width: '100%',
                  marginTop: 'var(--space-8)',
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <label htmlFor="override-justification" className="sr-only" style={{ display: 'none' }}>
                    Emergency Override Justification
                  </label>
                  <input
                    id="override-justification"
                    type="text"
                    className={`form-input ${overrideError ? 'is-invalid' : ''}`}
                    placeholder="Enter mandatory governance justification..."
                    value={overrideReason}
                    onChange={(e) => {
                      setOverrideReason(e.target.value)
                      if (e.target.value.trim()) setOverrideError(false)
                    }}
                    aria-invalid={overrideError}
                    aria-describedby={overrideError ? 'override-err' : undefined}
                  />
                  {overrideError && (
                    <span id="override-err" className="form-error-msg" role="alert">
                      A clear justification is required to execute an emergency freeze override.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleToggleFreeze('EMERGENCY_OVERRIDE')}
                  disabled={isLoading}
                >
                  Confirm Override
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowOverrideInput(false)
                    setOverrideError(false)
                    setOverrideReason('')
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Policy Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-32)' }}>
        {/* Quick Action 1: Test AI Injection */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
            <FileCode size={20} aria-hidden="true" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Injection Vulnerability Lab</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-16)' }}>
            Before any prompt or model update can bypass the freeze gate, verify it against direct prompt injections,
            roleplay jailbreaks, and delimiter escapes.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onNavigateToScanner}
            style={{ width: '100%', justifyContent: 'space-between' }}
            aria-label="Navigate to AI Injection Scanner"
          >
            <span>Launch Prompt Injection Scanner</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Quick Action 2: Inspect Structured Registry */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
            <ShieldCheck size={20} aria-hidden="true" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Manager Registry &amp; Audit</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-16)' }}>
            Structured, deterministic audit outputs for executive management. Filter by release status, review
            injection risk scores, and export structured JSON dossiers.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onNavigateToRegistry}
            style={{ width: '100%', justifyContent: 'space-between' }}
            aria-label="Navigate to Structured Registry"
          >
            <span>Review Production Module Registry</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
