import posthog from 'posthog-js'

declare global {
  interface Window {
    posthog?: typeof posthog
  }
}

export const initPostHog = () => {
  // Log environment check for debugging
  console.log('PostHog Init Check:', {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    environment: process.env.NODE_ENV
  });

  // Only initialize if analytics is enabled via environment variable
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      
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
      respect_dnt: true,
      mask_all_element_attributes: false,
      mask_all_text: false,
      
      // Performance
      capture_performance: true,
      property_denylist: [], // Don't block any properties
      
      // Debug mode disabled to reduce console noise
      debug: false,
    })
    
    // Log initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log('PostHog initialized for analytics tracking')
    }
  } else {
    // Log when analytics is disabled
    if (process.env.NODE_ENV === 'development') {
      console.log('PostHog analytics disabled via NEXT_PUBLIC_ENABLE_ANALYTICS=false')
    }
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
  if (typeof window !== 'undefined' && window.posthog && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
    const utmParams = getUTMParams()
    posthog.capture(eventName, {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      ...utmParams,
      ...properties
    })
  } 
  // Removed development logging to reduce console noise
}

export { posthog }