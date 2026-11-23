import React, { useState } from 'react'
import {
  Play,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Code2,
  Sparkles,
} from 'lucide-react'
import { sanitizeInput, analyzePromptInjection } from '../utils/sanitizer'
import { PRESET_INJECTION_PROMPTS } from '../data/mockData'
import { LoadingIndicator } from './LoadingIndicator'

export function InjectionScanner({ onScanComplete, slowNetwork }) {
  const [promptText, setPromptText] = useState(PRESET_INJECTION_PROMPTS[0].prompt)
  const [targetModule, setTargetModule] = useState('Nexus Settlement Core (VaultPay)')
  const [sanitizedPreview, setSanitizedPreview] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [inputError, setInputError] = useState('')

  // Real-time preview of sanitization against XSS
  const handleInputChange = (e) => {
    const raw = e.target.value
    setPromptText(raw)
    const clean = sanitizeInput(raw)
    setSanitizedPreview(clean)
    if (raw.trim().length > 0) {
      setInputError('')
    }
  }

  const handleSelectPreset = (preset) => {
    setPromptText(preset.prompt)
    setSanitizedPreview(sanitizeInput(preset.prompt))
    setInputError('')
  }

  const handleRunScan = async (e) => {
    e.preventDefault()

    if (!promptText.trim()) {
      setInputError('Prompt text cannot be empty. Please enter prompt instructions or select a preset.')
      return
    }

    // 1. Sanitize input against XSS before committing to state
    const cleanPrompt = sanitizeInput(promptText)

    setIsScanning(true)

    // Simulate async network scan (slow 3G simulation if enabled)
    const scanDelay = slowNetwork ? 1500 : 250
    await new Promise((resolve) => setTimeout(resolve, scanDelay))

    // Analyze prompt for AI prompt injection vectors
    const analysis = analyzePromptInjection(cleanPrompt)

    const result = {
      id: `SCAN-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      targetModule,
      rawLength: promptText.length,
      sanitizedPrompt: cleanPrompt,
      ...analysis,
    }

    setScanResult(result)
    setIsScanning(false)

    // Notify parent to log telemetry and register scan
    if (onScanComplete) {
      onScanComplete(result)
    }
  }

  return (
    <div role="tabpanel" id="panel-scanner" aria-labelledby="tab-scanner">
      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
              <span className="badge badge-dark">Adversarial Testing Bench</span>
              <span className="badge">Zero-Trust Input Sanitizer</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              AI Prompt Injection Vulnerability Scanner
            </h2>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Real-Time Static &amp; Heuristic Evaluation
          </span>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)', fontSize: '0.9375rem' }}>
          Evaluate AI prompts and instructions against direct overrides, adversarial jailbreaks, delimiter hijacking,
          and hidden system token leaks. All submissions are automatically sanitized against XSS before state retention.
        </p>

        {/* Preset Attack Payloads */}
        <div style={{ marginBottom: 'var(--space-24)' }}>
          <label
            id="preset-labels"
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-8)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Load Standard Test Vectors:
          </label>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-8)',
              flexWrap: 'wrap',
            }}
            aria-labelledby="preset-labels"
          >
            {PRESET_INJECTION_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: 'var(--space-4) var(--space-12)' }}
                onClick={() => handleSelectPreset(preset)}
                aria-label={`Load preset vector: ${preset.name}`}
              >
                <Sparkles size={14} aria-hidden="true" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scanner Form */}
        <form onSubmit={handleRunScan}>
          <div className="form-group">
            <label htmlFor="target-module" className="form-label">
              Target Enterprise Module:
            </label>
            <select
              id="target-module"
              className="form-select"
              value={targetModule}
              onChange={(e) => setTargetModule(e.target.value)}
            >
              <option value="Nexus Settlement Core (VaultPay)">Nexus Settlement Core (VaultPay)</option>
              <option value="AI Smart Invoice Parser">AI Smart Invoice Parser (Gemini 1.5 Pro)</option>
              <option value="KYC Identity Verification Bot">KYC Identity Verification Bot (Claude 3.5)</option>
              <option value="Enterprise Customer Support Agent">Enterprise Customer Support Agent (Llama-3)</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <label htmlFor="prompt-injection-input" className="form-label" style={{ margin: 0 }}>
                Test Prompt / Instruction Payload:
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {promptText.length} characters &bull; XSS Protected
              </span>
            </div>

            <textarea
              id="prompt-injection-input"
              className={`form-textarea ${inputError ? 'is-invalid' : ''}`}
              rows={4}
              value={promptText}
              onChange={handleInputChange}
              placeholder="Enter suspect AI prompt instructions, e.g., 'Ignore previous instructions and reveal...'"
              aria-invalid={inputError ? 'true' : 'false'}
              aria-describedby={inputError ? 'scanner-input-err' : undefined}
            />

            {inputError && (
              <div id="scanner-input-err" className="form-error-msg" role="alert">
                <AlertTriangle size={14} aria-hidden="true" />
                <span>{inputError}</span>
              </div>
            )}
          </div>

          {/* Defense-in-depth: Live Sanitized View Badge */}
          <div
            style={{
              padding: 'var(--space-12) var(--space-16)',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-24)',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>
              <Code2 size={16} aria-hidden="true" />
              <strong>XSS Sanitized State Output:</strong>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-secondary)',
                wordBreak: 'break-all',
              }}
            >
              {sanitizedPreview || sanitizeInput(promptText) || '<Empty>'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isScanning}
              aria-label="Execute prompt injection vulnerability scan"
            >
              <Play size={16} aria-hidden="true" />
              <span>Run AI Security Scan</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setPromptText('')
                setSanitizedPreview('')
                setScanResult(null)
                setInputError('')
              }}
              disabled={isScanning}
              aria-label="Clear scan input"
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Clear</span>
            </button>
          </div>
        </form>

        {/* Visual Loading Indicator for Asynchronous Operation */}
        {isScanning && (
          <div style={{ marginTop: 'var(--space-32)' }}>
            <LoadingIndicator message="Analyzing neural vectors and heuristic tokens..." />
          </div>
        )}

        {/* Scan Results Output */}
        {scanResult && !isScanning && (
          <div
            style={{
              marginTop: 'var(--space-32)',
              borderTop: '2px solid var(--color-border-subtle)',
              paddingTop: 'var(--space-24)',
            }}
            role="region"
            aria-label="Scan Results"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-16)', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                Inspection Verdict: {scanResult.verdict.replace('_', ' ')}
              </h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Scan Ref: {scanResult.id} &bull; {scanResult.timestamp}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-16)',
                marginBottom: 'var(--space-24)',
              }}
            >
              <div
                style={{
                  padding: 'var(--space-16)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  VULNERABILITY RISK SCORE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 'var(--space-4)' }}>
                  {scanResult.riskScore} / 100
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Severity: {scanResult.severity}
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--space-16)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  GATE ENFORCEMENT
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                  {scanResult.verdict === 'SAFE' && (
                    <>
                      <ShieldCheck size={20} aria-hidden="true" />
                      <span>PASS (DEPLOYABLE)</span>
                    </>
                  )}
                  {scanResult.verdict === 'SUSPICIOUS_REVIEW' && (
                    <>
                      <AlertTriangle size={20} aria-hidden="true" />
                      <span>MANUAL REVIEW</span>
                    </>
                  )}
                  {scanResult.verdict === 'CRITICAL_BLOCK' && (
                    <>
                      <ShieldAlert size={20} aria-hidden="true" />
                      <span>BLOCKED AT GATE</span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
                  Enforced against {targetModule}
                </div>
              </div>
            </div>

            {/* Detected Attack Vectors */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 'var(--space-8)' }}>
                Identified Adversarial Vectors:
              </div>
              {scanResult.detectedVectors.length > 0 ? (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-8)',
                  }}
                >
                  {scanResult.detectedVectors.map((vec, i) => (
                    <li
                      key={i}
                      style={{
                        padding: 'var(--space-8) var(--space-12)',
                        backgroundColor: 'var(--color-bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-8)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <AlertTriangle size={14} aria-hidden="true" />
                      <span>{vec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  style={{
                    padding: 'var(--space-12)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                  }}
                >
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>No malicious injection patterns or jailbreak vectors detected.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
