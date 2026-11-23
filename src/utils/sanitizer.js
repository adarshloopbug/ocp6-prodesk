import DOMPurify from 'dompurify'

/**
 * Enterprise XSS Input Sanitizer
 * Strips all malicious HTML tags, JavaScript event handlers, and protocol vectors
 * before data is stored into application state. Functions universally in browser and Node environments.
 */
export function sanitizeInput(rawText) {
  if (typeof rawText !== 'string') {
    return ''
  }

  let purified = rawText

  // 1. Pass through DOMPurify if running in browser with DOM
  if (typeof window !== 'undefined') {
    if (typeof DOMPurify.sanitize === 'function') {
      purified = DOMPurify.sanitize(rawText, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      })
    } else if (typeof DOMPurify === 'function') {
      try {
        const purifyInstance = DOMPurify(window)
        if (purifyInstance && typeof purifyInstance.sanitize === 'function') {
          purified = purifyInstance.sanitize(rawText, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true,
          })
        }
      } catch {
        purified = rawText.replace(/<[^>]*>/g, '')
      }
    }
  } else {
    // Defense-in-depth HTML tag & script stripper for Node / test runner environments
    purified = rawText.replace(/<[^>]*>/g, '')
  }

  // 2. Escape raw markup boundary characters for defense-in-depth
  return purified
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Detection heuristics for AI Prompt Injection vectors:
 * - Direct Instruction Overrides
 * - Roleplay / Jailbreaks
 * - Delimiter manipulation / Context breaks
 * - Information Exfiltration
 */
export function analyzePromptInjection(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return {
      riskScore: 0,
      verdict: 'SAFE',
      detectedVectors: [],
      severity: 'LOW',
    }
  }

  const normalized = prompt.toLowerCase()
  const detectedVectors = []

  const attackPatterns = [
    {
      id: 'DIRECT_OVERRIDE',
      name: 'System Prompt Override',
      regex: /(ignore\s+all\s+(previous|prior)\s+instructions|disregard\s+(previous|all)\s+instructions|forget\s+all\s+rules|system\s+override)/i,
      weight: 45,
    },
    {
      id: 'JAILBREAK_ROLEPLAY',
      name: 'Adversarial Jailbreak / Persona Hijack',
      regex: /(you\s+are\s+now\s+dan|developer\s+mode\s+enabled|always\s+say\s+yes|bypass\s+safety|unfiltered\s+mode|act\s+as\s+an\s+unrestricted)/i,
      weight: 40,
    },
    {
      id: 'DELIMITER_ESCAPE',
      name: 'Delimiter Hijacking / Context Break',
      regex: /(```\s*system|<\|im_start\|>|<\|system\|>|\[system\s*#\]|human:\s*assistant:)/i,
      weight: 35,
    },
    {
      id: 'SECRET_EXFILTRATION',
      name: 'Secret / API Key Exfiltration Probe',
      regex: /(print\s+your\s+(api\s*key|initial\s*instructions|system\s*prompt)|reveal\s+hidden\s+token|show\s+internal\s+configuration)/i,
      weight: 35,
    },
    {
      id: 'CODE_INJECTION',
      name: 'Script Execution / Code Injection payload',
      regex: /(<script|javascript:|eval\(|onerror=|onload=|<\/script>)/i,
      weight: 50,
    },
  ]

  let totalScore = 0

  attackPatterns.forEach((pattern) => {
    if (pattern.regex.test(normalized)) {
      detectedVectors.push(pattern.name)
      totalScore += pattern.weight
    }
  })

  // Normalize score between 0 and 100
  const riskScore = Math.min(100, totalScore)

  let verdict = 'SAFE'
  let severity = 'LOW'

  if (riskScore >= 70) {
    verdict = 'CRITICAL_BLOCK'
    severity = 'CRITICAL'
  } else if (riskScore >= 35) {
    verdict = 'SUSPICIOUS_REVIEW'
    severity = 'MEDIUM'
  }

  return {
    riskScore,
    verdict,
    severity,
    detectedVectors,
  }
}
