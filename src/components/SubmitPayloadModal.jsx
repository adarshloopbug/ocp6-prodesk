import React, { useState, useEffect, useRef } from 'react'
import { X, AlertTriangle, ShieldCheck } from 'lucide-react'
import { sanitizeInput, analyzePromptInjection } from '../utils/sanitizer'
import { LoadingIndicator } from './LoadingIndicator'

export function SubmitPayloadModal({
  isOpen,
  onClose,
  onSubmitPayload,
  slowNetwork,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'AI Pipeline',
    targetModel: 'GPT-4o Enterprise Gateway',
    promptPayload: '',
    leadEngineer: '',
    justification: '',
    freezeStatus: 'FROZEN',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firstInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setErrors({})
      setIsSubmitting(false)
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus()
        }
      }, 50)
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Module / Test Name is required (minimum 3 characters).'
    }

    if (!formData.leadEngineer.trim()) {
      newErrors.leadEngineer = 'Lead Engineer name is required for governance tracking.'
    }

    if (!formData.promptPayload.trim() || formData.promptPayload.trim().length < 10) {
      newErrors.promptPayload =
        'AI Prompt payload must contain valid test instructions (minimum 10 characters).'
    }

    if (!formData.justification.trim() || formData.justification.trim().length < 5) {
      newErrors.justification =
        'A formal governance justification or audit note is required (minimum 5 characters).'
    }

    return newErrors
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Focus the first offending input element
      const firstOffenderKey = Object.keys(validationErrors)[0]
      const el = document.getElementById(`form-${firstOffenderKey}`)
      if (el) el.focus()
      return
    }

    setIsSubmitting(true)

    // Simulate network delay if Slow 3G is enabled
    const delay = slowNetwork ? 1500 : 300
    await new Promise((res) => setTimeout(res, delay))

    // 1. Sanitize all text fields against XSS before state retention
    const sanitizedName = sanitizeInput(formData.name)
    const sanitizedEngineer = sanitizeInput(formData.leadEngineer)
    const sanitizedPayload = sanitizeInput(formData.promptPayload)
    const sanitizedJustification = sanitizeInput(formData.justification)

    // 2. Perform AI Injection heuristic scan
    const analysis = analyzePromptInjection(sanitizedPayload)

    const newModuleEntry = {
      id: `MOD-${Math.floor(100 + Math.random() * 900)}`,
      name: sanitizedName,
      category: formData.category,
      currentVersion: 'v1.0.0-rc1',
      freezeStatus: formData.freezeStatus,
      aiModelTarget: formData.targetModel,
      injectionRiskScore: analysis.riskScore,
      injectionVerdict: analysis.verdict,
      lastAudited: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      leadEngineer: sanitizedEngineer,
      justification: sanitizedJustification,
      criticality: analysis.riskScore > 50 ? 'HIGH' : 'MEDIUM',
    }

    setIsSubmitting(false)
    onSubmitPayload(newModuleEntry)
    onClose()
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-payload-title"
    >
      <div className="modal-dialog">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-16)',
            paddingBottom: 'var(--space-16)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div>
            <span className="badge badge-dark" style={{ marginBottom: 'var(--space-4)' }}>
              Security State Retention
            </span>
            <h2 id="modal-payload-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Submit AI Injection Test Payload / Bypass
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ minHeight: '36px', padding: 'var(--space-4) var(--space-8)' }}
            onClick={onClose}
            aria-label="Close modal dialog"
            disabled={isSubmitting}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-24)' }}>
          All fields are validated for completeness. Missing or malformed inputs will be highlighted in red.
          Text content will be sanitized against XSS injection before being committed into the module registry.
        </p>

        {isSubmitting ? (
          <LoadingIndicator message="Validating payload and executing XSS sanitization..." />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Module Name */}
            <div className="form-group">
              <label htmlFor="form-name" className="form-label">
                Module / Target Service Name: <span aria-hidden="true">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="form-name"
                type="text"
                className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Financial Risk Orchestrator"
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'error-name' : undefined}
              />
              {errors.name && (
                <div id="error-name" className="form-error-msg" role="alert">
                  <AlertTriangle size={14} aria-hidden="true" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Field 2: Target AI Model & Category */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-16)',
                marginBottom: 'var(--space-16)',
              }}
            >
              <div>
                <label htmlFor="form-targetModel" className="form-label">
                  Target AI Model Gateway:
                </label>
                <select
                  id="form-targetModel"
                  className="form-select"
                  value={formData.targetModel}
                  onChange={(e) => handleChange('targetModel', e.target.value)}
                >
                  <option value="GPT-4o Enterprise Gateway">GPT-4o Enterprise Gateway</option>
                  <option value="Gemini 1.5 Pro Parser">Gemini 1.5 Pro Parser</option>
                  <option value="Claude 3.5 Sonnet Sentinel">Claude 3.5 Sonnet Sentinel</option>
                  <option value="Nexus Private Llama-3 70B">Nexus Private Llama-3 70B</option>
                </select>
              </div>

              <div>
                <label htmlFor="form-freezeStatus" className="form-label">
                  Initial Freeze Status:
                </label>
                <select
                  id="form-freezeStatus"
                  className="form-select"
                  value={formData.freezeStatus}
                  onChange={(e) => handleChange('freezeStatus', e.target.value)}
                >
                  <option value="FROZEN">FROZEN (Standard Lock)</option>
                  <option value="EMERGENCY_OVERRIDE">EMERGENCY OVERRIDE</option>
                  <option value="THAWED">THAWED (Pre-approved)</option>
                </select>
              </div>
            </div>

            {/* Field 3: Prompt Injection Payload */}
            <div className="form-group">
              <label htmlFor="form-promptPayload" className="form-label">
                AI Prompt Test Payload: <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="form-promptPayload"
                className={`form-textarea ${errors.promptPayload ? 'is-invalid' : ''}`}
                rows={3}
                value={formData.promptPayload}
                onChange={(e) => handleChange('promptPayload', e.target.value)}
                placeholder="Enter AI prompt payload to test for injection (min 10 chars)..."
                aria-required="true"
                aria-invalid={errors.promptPayload ? 'true' : 'false'}
                aria-describedby={errors.promptPayload ? 'error-promptPayload' : undefined}
              />
              {errors.promptPayload && (
                <div id="error-promptPayload" className="form-error-msg" role="alert">
                  <AlertTriangle size={14} aria-hidden="true" />
                  <span>{errors.promptPayload}</span>
                </div>
              )}
            </div>

            {/* Field 4: Lead Engineer */}
            <div className="form-group">
              <label htmlFor="form-leadEngineer" className="form-label">
                Lead Engineer / Submitter: <span aria-hidden="true">*</span>
              </label>
              <input
                id="form-leadEngineer"
                type="text"
                className={`form-input ${errors.leadEngineer ? 'is-invalid' : ''}`}
                value={formData.leadEngineer}
                onChange={(e) => handleChange('leadEngineer', e.target.value)}
                placeholder="e.g., Evelyn Croft, Lead Architect"
                aria-required="true"
                aria-invalid={errors.leadEngineer ? 'true' : 'false'}
                aria-describedby={errors.leadEngineer ? 'error-leadEngineer' : undefined}
              />
              {errors.leadEngineer && (
                <div id="error-leadEngineer" className="form-error-msg" role="alert">
                  <AlertTriangle size={14} aria-hidden="true" />
                  <span>{errors.leadEngineer}</span>
                </div>
              )}
            </div>

            {/* Field 5: Governance Justification */}
            <div className="form-group">
              <label htmlFor="form-justification" className="form-label">
                Governance Justification &amp; Risk Notes: <span aria-hidden="true">*</span>
              </label>
              <input
                id="form-justification"
                type="text"
                className={`form-input ${errors.justification ? 'is-invalid' : ''}`}
                value={formData.justification}
                onChange={(e) => handleChange('justification', e.target.value)}
                placeholder="e.g., Pre-deployment adversarial validation test"
                aria-required="true"
                aria-invalid={errors.justification ? 'true' : 'false'}
                aria-describedby={errors.justification ? 'error-justification' : undefined}
              />
              {errors.justification && (
                <div id="error-justification" className="form-error-msg" role="alert">
                  <AlertTriangle size={14} aria-hidden="true" />
                  <span>{errors.justification}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 'var(--space-12)',
                marginTop: 'var(--space-24)',
                paddingTop: 'var(--space-16)',
                borderTop: '1px solid var(--color-border-subtle)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                aria-label="Submit payload and register module"
              >
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Sanitize &amp; Submit Payload</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
