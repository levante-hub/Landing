import posthog from 'posthog-js'

declare global {
  interface Window {
    posthog?: typeof posthog
  }
}

type QueuedEvent = {
  name: string
  properties?: Record<string, any>
}

const queuedEvents: QueuedEvent[] = []
let posthogReady = false

const flushQueuedEvents = () => {
  if (!posthogReady || typeof window === 'undefined' || !window.posthog) return

  while (queuedEvents.length) {
    const { name, properties } = queuedEvents.shift()!
    window.posthog.capture(name, properties)
  }
}

export const initPostHog = () => {
  // Only initialize if analytics is enabled via environment variable
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: window.location.origin + '/starlight', // renamed path to evade filters
      ui_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,

      // Proxy activado - Los eventos ahora van a /ingest para evitar ad-blockers
      // Next.js automáticamente los reenvía a PostHog usando el rewrite configurado

      // Enable key features
      autocapture: {
        dom_event_allowlist: ['click'], // Only capture clicks
        url_allowlist: [], // Allow all URLs
        element_allowlist: ['button', 'a'], // Only track buttons and links
      },
      session_recording: {
        recordCrossOriginIframes: true,
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: false,
        }
      },

      // Privacy settings
      respect_dnt: false,
      mask_all_element_attributes: false,
      mask_all_text: false,

      // Performance
      capture_performance: true,
      property_denylist: [], // Don't block any properties

      // Keep debug off to avoid SDK console noise
      debug: false,
      loaded: (ph) => {
        window.posthog = ph;
        posthogReady = true
        flushQueuedEvents()
      }
    })
  } else {
  }
}

// Get UTM parameters from URL
export const getUTMParams = () => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_content: urlParams.get('utm_content'),
    utm_term: urlParams.get('utm_term'),
    referrer: document.referrer
  }
}

// Safe capture function that checks if PostHog is initialized
export const safeCapture = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') {
    console.warn('[PostHog] Cannot capture event - window is undefined')
    return
  }

  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') {
    console.log('[PostHog] Analytics disabled via env var')
    return
  }

  try {
    const utmParams = getUTMParams()
    const eventData = {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      ...utmParams,
      ...properties
    }

    if (!posthogReady || !window.posthog) {
      console.warn('[PostHog] PostHog not initialized yet for event:', eventName)
      queuedEvents.push({ name: eventName, properties: eventData })
      return
    }

    window.posthog.capture(eventName, eventData)
    console.log('[PostHog] Event captured:', eventName, eventData)
  } catch (error) {
    console.error('[PostHog] Error capturing event:', error)
  }
}

export { posthog }
