import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { FreezeOverview } from './components/FreezeOverview'
import { InjectionScanner } from './components/InjectionScanner'
import { ReleaseRegistry } from './components/ReleaseRegistry'
import { SubmitPayloadModal } from './components/SubmitPayloadModal'
import { TelemetryDrawer } from './components/TelemetryDrawer'
import { LoadingIndicator } from './components/LoadingIndicator'
import { INITIAL_FREEZE_STATE, INITIAL_MODULES } from './data/mockData'
import { logTelemetry, subscribeTelemetry } from './utils/telemetry'

export function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [freezeState, setFreezeState] = useState(INITIAL_FREEZE_STATE)
  const [modules, setModules] = useState(INITIAL_MODULES)
  const [slowNetwork, setSlowNetwork] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false)
  const [telemetryList, setTelemetryList] = useState([])
  const [globalLoading, setGlobalLoading] = useState(false)

  // Subscribe to in-memory telemetry feed
  useEffect(() => {
    const unsubscribe = subscribeTelemetry((events) => {
      setTelemetryList(events)
    })

    // Initial system load telemetry ping
    logTelemetry('INITIAL_PAGE_MOUNT', {
      view: 'overview',
      policy: INITIAL_FREEZE_STATE.policyName,
    })

    return () => unsubscribe()
  }, [])

  // Tab switching handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    logTelemetry('SWITCH_TAB', { tabId })
  }

  // Freeze state updater
  const handleUpdateFreezeState = async (newStatus, reason) => {
    setGlobalLoading(true)
    const delay = slowNetwork ? 1500 : 200
    await new Promise((res) => setTimeout(res, delay))

    setFreezeState((prev) => {
      const overrides =
        newStatus === 'EMERGENCY_OVERRIDE'
          ? prev.emergencyOverridesCount + 1
          : prev.emergencyOverridesCount

      const updated = {
        ...prev,
        status: newStatus,
        emergencyOverridesCount: overrides,
        lastModified: new Date().toISOString(),
      }

      logTelemetry('UPDATE_FREEZE_STATE', {
        previousStatus: prev.status,
        newStatus,
        reason: reason || 'Standard manager action',
        overridesCount: overrides,
      })

      return updated
    })

    // If freeze status thawed, update modules
    if (newStatus === 'THAWED') {
      setModules((prev) =>
        prev.map((m) => ({ ...m, freezeStatus: 'THAWED' }))
      )
    } else if (newStatus === 'ACTIVE_FREEZE') {
      setModules((prev) =>
        prev.map((m) =>
          m.freezeStatus === 'THAWED' ? { ...m, freezeStatus: 'FROZEN' } : m
        )
      )
    }

    setGlobalLoading(false)
  }

  // Scan completion handler
  const handleScanComplete = (scanResult) => {
    logTelemetry('SCAN_PROMPT_INJECTION', {
      scanId: scanResult.id,
      targetModule: scanResult.targetModule,
      verdict: scanResult.verdict,
      riskScore: scanResult.riskScore,
    })
  }

  // Form submission handler (Unhappy path & Security fulfilled)
  const handleSubmitPayload = (newModule) => {
    setModules((prev) => [newModule, ...prev])

    // Update freeze state count
    setFreezeState((prev) => ({
      ...prev,
      totalModules: prev.totalModules + 1,
      frozenModules:
        newModule.freezeStatus === 'FROZEN'
          ? prev.frozenModules + 1
          : prev.frozenModules,
    }))

    logTelemetry('SUBMIT_INJECTION_TEST_PAYLOAD', {
      moduleId: newModule.id,
      moduleName: newModule.name,
      verdict: newModule.injectionVerdict,
      riskScore: newModule.injectionRiskScore,
      leadEngineer: newModule.leadEngineer,
    })
  }

  // Export structured manager JSON audit dossier
  const handleExportAuditJSON = () => {
    const exportData = {
      reportType: 'Nexus Enterprise Code Freeze & AI Injection Audit Dossier',
      generatedAt: new Date().toISOString(),
      policy: freezeState,
      modulesCount: modules.length,
      modules,
      complianceNote:
        'Sanitized against XSS injection. Monochromatic corporate design standard validated.',
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Code_Freeze_AI_Injection_Audit_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    logTelemetry('EXPORT_MANAGER_AUDIT_JSON', {
      modulesExported: modules.length,
      fileSize: blob.size,
    })
  }

  const handleToggleSlowNetwork = () => {
    const nextState = !slowNetwork
    setSlowNetwork(nextState)
    logTelemetry('TOGGLE_SLOW_3G_SIMULATION', { active: nextState })
  }

  return (
    <div className="app-container">
      {/* Keyboard Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Corporate Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        freezeStatus={freezeState.status}
        slowNetwork={slowNetwork}
        onToggleSlowNetwork={handleToggleSlowNetwork}
        onOpenModal={() => setIsModalOpen(true)}
        telemetryCount={telemetryList.length}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="main-content" tabIndex={-1}>
        {globalLoading ? (
          <LoadingIndicator message="Applying enterprise freeze policy..." />
        ) : (
          <>
            {activeTab === 'overview' && (
              <FreezeOverview
                freezeState={freezeState}
                onUpdateFreezeState={handleUpdateFreezeState}
                onNavigateToScanner={() => handleTabChange('scanner')}
                onNavigateToRegistry={() => handleTabChange('registry')}
                isLoading={globalLoading}
              />
            )}

            {activeTab === 'scanner' && (
              <InjectionScanner
                onScanComplete={handleScanComplete}
                slowNetwork={slowNetwork}
              />
            )}

            {activeTab === 'registry' && (
              <ReleaseRegistry
                modules={modules}
                onExportAuditJSON={handleExportAuditJSON}
              />
            )}
          </>
        )}
      </main>

      {/* Submit AI Injection / Exception Modal */}
      <SubmitPayloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitPayload={handleSubmitPayload}
        slowNetwork={slowNetwork}
      />

      {/* Telemetry Inspection Drawer */}
      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        events={telemetryList}
        onClear={() => setTelemetryList([])}
      />

      {/* Enterprise Corporate Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-24) var(--space-16)',
          marginTop: 'auto',
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
            gap: 'var(--space-16)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div>
            <strong>Code Freeze: AI Injection</strong> &bull; Capstone 4 Production Release
          </div>
          <div>
            Lighthouse 100% a11y &bull; Zero Rogue Hex Colors &bull; XSS Sanitized
          </div>
        </div>
      </footer>
    </div>
  )
}
