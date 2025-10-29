import { useEffect } from 'react'
import { safeCapture, getUTMParams } from '@/lib/posthog'

export const useUTMTracking = () => {
  useEffect(() => {
    // Track page view with UTM parameters
    const utmParams = getUTMParams()
    const fragment = window.location.hash.substring(1)
    
    // Track page view with source attribution
    safeCapture('$pageview', {
      ...utmParams,
      fragment,
      landing_page: true
    })

    // If there's a UTM source, track traffic source
    if (utmParams.utm_source) {
      safeCapture('traffic_source_visit', {
        source: utmParams.utm_source,
        medium: utmParams.utm_medium,
        campaign: utmParams.utm_campaign,
        content: utmParams.utm_content
      })
    }

    // Handle fragment-based actions for social media deep links
    if (fragment) {
      handleFragmentAction(fragment, utmParams)
    }

    // Store UTM data in session for attribution
    if (utmParams.utm_source) {
      sessionStorage.setItem('levante_utm_data', JSON.stringify(utmParams))
    }
  }, [])

  const handleFragmentAction = (fragment: string, utmParams: any) => {
    safeCapture('fragment_navigation', { 
      fragment, 
      source: utmParams.utm_source 
    })
    
    switch (fragment) {
      case 'download':
        // Scroll to download and track intent
        setTimeout(() => {
          document.querySelector('[data-download-cta]')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          safeCapture('download_intent_from_social', {
            source: utmParams.utm_source,
            fragment: 'download'
          })
        }, 500)
        break
        
      case 'features':
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
          safeCapture('features_intent_from_social', {
            source: utmParams.utm_source,
            fragment: 'features'
          })
        }, 500)
        break
        
      case 'contribute':
        // Trigger questionnaire modal
        safeCapture('contribute_intent_from_social', {
          source: utmParams.utm_source,
          fragment: 'contribute'
        })
        break
    }
  }

  return { getUTMParams }
}