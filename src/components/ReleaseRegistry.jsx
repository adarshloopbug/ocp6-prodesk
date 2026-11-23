import React, { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Lock,
  Unlock,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react'
import { EmptyState } from './EmptyState'

export function ReleaseRegistry({
  modules,
  onExportAuditJSON,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [freezeFilter, setFreezeFilter] = useState('ALL')
  const [verdictFilter, setVerdictFilter] = useState('ALL')
  const [copiedId, setCopiedId] = useState(null)

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.leadEngineer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFreeze =
        freezeFilter === 'ALL' || mod.freezeStatus === freezeFilter

      const matchesVerdict =
        verdictFilter === 'ALL' || mod.injectionVerdict === verdictFilter

      return matchesSearch && matchesFreeze && matchesVerdict
    })
  }, [modules, searchQuery, freezeFilter, verdictFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setFreezeFilter('ALL')
    setVerdictFilter('ALL')
  }

  const handleCopyRowData = (mod) => {
    const jsonString = JSON.stringify(mod, null, 2)
    navigator.clipboard.writeText(jsonString)
    setCopiedId(mod.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div role="tabpanel" id="panel-registry" aria-labelledby="tab-registry">
      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
              <span className="badge badge-dark">Manager Audit Registry</span>
              <span className="badge">Deterministic Schema</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Structured Release &amp; AI Security Registry
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onExportAuditJSON}
              aria-label="Export manager audit dossier as structured JSON"
            >
              <Download size={16} aria-hidden="true" />
              <span>Export Manager JSON Dossier</span>
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)', fontSize: '0.9375rem' }}>
          Real-time enterprise inventory of production modules, targeted AI models, prompt vulnerability risk scores,
          and code freeze compliance status.
        </p>

        {/* Filter and Search Controls */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-16)',
            marginBottom: 'var(--space-24)',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Box */}
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <label htmlFor="registry-search" className="sr-only" style={{ display: 'none' }}>
              Search modules by name, ID, or lead engineer
            </label>
            <div
              style={{
                position: 'absolute',
                left: 'var(--space-12)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            >
              <Search size={16} aria-hidden="true" />
            </div>
            <input
              id="registry-search"
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by module name, ID, or engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search modules by name, ID, or lead engineer"
            />
          </div>

          {/* Freeze Status Filter */}
          <div style={{ minWidth: '180px' }}>
            <label htmlFor="freeze-filter" className="sr-only" style={{ display: 'none' }}>
              Filter by Freeze Status
            </label>
            <select
              id="freeze-filter"
              className="form-select"
              value={freezeFilter}
              onChange={(e) => setFreezeFilter(e.target.value)}
              aria-label="Filter modules by code freeze status"
            >
              <option value="ALL">All Freeze States</option>
              <option value="FROZEN">Frozen Only</option>
              <option value="EMERGENCY_OVERRIDE">Emergency Overrides</option>
              <option value="THAWED">Thawed (Open)</option>
            </select>
          </div>

          {/* Verdict Filter */}
          <div style={{ minWidth: '180px' }}>
            <label htmlFor="verdict-filter" className="sr-only" style={{ display: 'none' }}>
              Filter by AI Verdict
            </label>
            <select
              id="verdict-filter"
              className="form-select"
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              aria-label="Filter modules by AI injection verdict"
            >
              <option value="ALL">All AI Verdicts</option>
              <option value="SAFE">Safe (Pass)</option>
              <option value="SUSPICIOUS_REVIEW">Suspicious (Review)</option>
              <option value="CRITICAL_BLOCK">Critical (Blocked)</option>
            </select>
          </div>
        </div>

        {/* Content Area: Table or Empty State */}
        {filteredModules.length === 0 ? (
          <EmptyState
            title="No data found"
            description={`No production modules match your filter "${searchQuery || freezeFilter !== 'ALL' ? freezeFilter : verdictFilter}". Try clearing your search parameters.`}
            onReset={handleResetFilters}
          />
        ) : (
          <div className="corporate-table-wrapper" tabIndex={0} aria-label="Modules data table">
            <table className="corporate-table">
              <thead>
                <tr>
                  <th scope="col">Module / ID</th>
                  <th scope="col">Category</th>
                  <th scope="col">Version</th>
                  <th scope="col">Freeze Gate</th>
                  <th scope="col">Target AI Model</th>
                  <th scope="col">Risk Score</th>
                  <th scope="col">Security Verdict</th>
                  <th scope="col">Lead Engineer</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((mod) => (
                  <tr key={mod.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{mod.name}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                        {mod.id}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{mod.category}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{mod.currentVersion}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-4)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {mod.freezeStatus === 'FROZEN' && <Lock size={14} aria-hidden="true" />}
                        {mod.freezeStatus === 'EMERGENCY_OVERRIDE' && <AlertTriangle size={14} aria-hidden="true" />}
                        {mod.freezeStatus === 'THAWED' && <Unlock size={14} aria-hidden="true" />}
                        <span>{mod.freezeStatus.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{mod.aiModelTarget}</td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {mod.injectionRiskScore}/100
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {mod.injectionVerdict}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{mod.leadEngineer}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ minHeight: '32px', padding: 'var(--space-4) var(--space-8)', fontSize: '0.75rem' }}
                        onClick={() => handleCopyRowData(mod)}
                        aria-label={`Copy JSON data for module ${mod.id}`}
                      >
                        {copiedId === mod.id ? (
                          <>
                            <Check size={12} aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} aria-hidden="true" />
                            <span>JSON</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-16)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing {filteredModules.length} of {modules.length} registered modules</span>
          <span>Zero external telemetry leaks &bull; Safe for CI/CD</span>
        </div>
      </div>
    </div>
  )
}
