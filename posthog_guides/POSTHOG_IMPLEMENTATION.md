# 🚀 PostHog Analytics Implementation Guide - Levante Landing

## Prompt para Senior Developer

**Contexto**: Implementar sistema completo de analytics usando **PostHog** (mejor que Umami) para el landing page de Levante. PostHog ofrece 1M eventos gratis vs 100K de Umami, plus features avanzadas nativas.

**Ventajas de PostHog**:
- ✅ **1M eventos/mes gratis** (10x más que Umami)
- ✅ **Funnels nativos** para conversion tracking
- ✅ **Session recordings** para ver user behavior
- ✅ **Feature flags** para A/B testing
- ✅ **Dashboard building** sin código adicional
- ✅ **Cohort analysis** y retention nativo

**Objetivos**:
1. Trackear **downloads** y **contribuciones** con funnels
2. **Attribution** completa de campañas social media
3. **A/B testing** de CTAs y copy
4. **Dashboard ejecutivo** nativo en PostHog
5. **Session recordings** para UX optimization

**Deadline**: 1 semana
**Tech Stack**: Next.js 16 + TypeScript + PostHog

---

## 📦 Installation & Setup

### Step 1: Install PostHog

```bash
npm install posthog-js
```

### Step 2: Environment Variables

**File**: `.env.local`
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Step 3: PostHog Provider Setup

**File**: `src/lib/posthog.ts`

```typescript
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      
      // Enable key features
      autocapture: true,
      session_recording: {
        enabled: true,
        recordCrossOriginIframes: true,
      },
      
      // Privacy settings
      respect_dnt: true,
      mask_all_element_attributes: false,
      mask_all_text: false,
      
      // UTM tracking
      capture_performance: true,
      property_blacklist: [], // Don't block any properties
    })
  }
}

export { posthog }
```

### Step 4: Layout Integration

**File**: `src/app/layout.tsx`

```typescript
'use client'
import { useEffect } from 'react'
import { initPostHog } from '@/lib/posthog'
import { PostHogProvider } from 'posthog-js/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initPostHog()
  }, [])

  return (
    <html lang="en">
      <body>
        <PostHogProvider client={posthog}>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

## 📊 Analytics Implementation

### Step 5: Analytics Utilities

**File**: `src/lib/analytics.ts`

```typescript
import { posthog } from './posthog'

// Utility functions for tracking
export const analytics = {
  // Track events with consistent structure
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, {
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        ...properties
      })
    }
  },

  // Get UTM parameters automatically
  getUTMParams: () => {
    if (typeof window === 'undefined') return {}
    
    const urlParams = new URLSearchParams(window.location.search)
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_content: urlParams.get('utm_content'),
      utm_term: urlParams.get('utm_term'),
    }
  },

  // Track downloads with context
  trackDownload: (location: 'hero' | 'navbar' | 'footer') => {
    const utmParams = analytics.getUTMParams()
    analytics.track('download_click', {
      button_location: location,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      page_section: location,
      ...utmParams
    })
  },

  // Track contribution funnel
  trackContribute: (step: 'start' | 'complete', data?: any) => {
    const utmParams = analytics.getUTMParams()
    
    if (step === 'start') {
      analytics.track('contribute_start', {
        trigger_source: data?.source || 'unknown',
        ...utmParams
      })
    } else {
      analytics.track('questionnaire_complete', {
        responses_count: data?.responses || 0,
        completion_time: data?.completionTime || 0,
        ...utmParams
      })
    }
  },

  // Track navigation and engagement
  trackNavigation: (destination: string, method: 'click' | 'scroll' = 'click') => {
    analytics.track('navigation', {
      destination_section: destination,
      navigation_method: method
    })
  },

  // Track section views with intersection observer
  trackSectionView: (section: string, timeSpent?: number) => {
    analytics.track('section_view', {
      section_name: section,
      time_spent: timeSpent,
      scroll_depth: Math.round((window.scrollY / document.body.scrollHeight) * 100)
    })
  },

  // Track scroll milestones
  trackScrollDepth: (percentage: number) => {
    analytics.track('scroll_depth', {
      depth_percentage: percentage,
      page_height: document.body.scrollHeight
    })
  },

  // Identify users for better tracking
  identifyUser: (userId?: string, traits?: Record<string, any>) => {
    if (userId) {
      posthog.identify(userId, traits)
    } else {
      // Anonymous user with device info
      posthog.identify(undefined, {
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        user_agent: navigator.userAgent,
        ...traits
      })
    }
  },

  // Track feature interactions
  trackFeatureClick: (feature: string, context?: any) => {
    analytics.track('feature_interaction', {
      feature_name: feature,
      interaction_type: 'click',
      ...context
    })
  }
}

// Auto-track page views with UTM
export const trackPageView = () => {
  const utmParams = analytics.getUTMParams()
  const fragment = window.location.hash.substring(1)
  
  posthog.capture('$pageview', {
    ...utmParams,
    fragment,
    referrer: document.referrer,
    page_title: document.title
  })
}
```

### Step 6: Custom Hooks

**File**: `src/hooks/usePostHogAnalytics.ts`

```typescript
import { useEffect, useRef } from 'react'
import { analytics, trackPageView } from '@/lib/analytics'

export const usePostHogAnalytics = () => {
  const scrollThresholds = useRef(new Set<number>())

  useEffect(() => {
    // Track initial page view
    trackPageView()
    
    // Identify anonymous user
    analytics.identifyUser()
    
    // Handle URL fragments for deep linking
    const fragment = window.location.hash.substring(1)
    if (fragment) {
      handleFragment(fragment)
    }

    // Setup scroll tracking
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      // Track scroll milestones
      [25, 50, 75, 100].forEach(threshold => {
        if (scrollPercent >= threshold && !scrollThresholds.current.has(threshold)) {
          scrollThresholds.current.add(threshold)
          analytics.trackScrollDepth(threshold)
        }
      })
    }

    // Debounce scroll events
    let scrollTimeout: NodeJS.Timeout
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', debouncedScroll)
    return () => {
      window.removeEventListener('scroll', debouncedScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const handleFragment = (fragment: string) => {
    analytics.track('fragment_navigation', { fragment })
    
    switch (fragment) {
      case 'download':
        // Scroll to download and highlight
        document.querySelector('[data-download-btn]')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        break
      case 'features':
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'contribute':
        // Will trigger questionnaire open
        analytics.track('fragment_contribute_trigger')
        break
      case 'team':
        document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'demo':
        document.querySelector('[data-chat-demo]')?.scrollIntoView({ behavior: 'smooth' })
        break
    }
  }

  return { 
    analytics, 
    handleFragment,
    trackPageView 
  }
}
```

**File**: `src/hooks/useIntersectionObserver.ts`

```typescript
import { useEffect, useRef, useState } from 'react'
import { analytics } from '@/lib/analytics'

export const useIntersectionObserver = (
  sectionName: string, 
  options: IntersectionObserverInit = { threshold: 0.5 }
) => {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const viewStartTime = useRef<number>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          viewStartTime.current = Date.now()
          analytics.trackSectionView(sectionName)
        } else if (!entry.isIntersecting && isVisible) {
          setIsVisible(false)
          if (viewStartTime.current) {
            const timeSpent = Date.now() - viewStartTime.current
            analytics.trackSectionView(`${sectionName}_exit`, timeSpent)
          }
        }
      },
      options
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [sectionName, isVisible, options])

  return { ref, isVisible }
}
```

## 🎯 Component Implementation

### Step 7: Update Main Page

**File**: `src/app/page.tsx` - Add tracking to key elements

```typescript
"use client"

import { useState, useEffect } from "react"
import { usePostHogAnalytics } from "@/hooks/usePostHogAnalytics"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { analytics } from "@/lib/analytics"
// ... other imports

export default function Home() {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)
  const { handleFragment } = usePostHogAnalytics()
  
  // Section observers for engagement tracking
  const featuresSection = useIntersectionObserver('features')
  const teamSection = useIntersectionObserver('team')
  const aboutSection = useIntersectionObserver('about')

  const openQuestionnaire = (source: string = 'unknown') => {
    setIsQuestionnaireOpen(true)
    analytics.trackContribute('start', { source })
  }

  const closeQuestionnaire = () => setIsQuestionnaireOpen(false)

  const scrollToSection = (sectionId: string) => {
    analytics.trackNavigation(sectionId, 'click')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle fragment-based questionnaire opening
  useEffect(() => {
    const fragment = window.location.hash.substring(1)
    if (fragment === 'contribute') {
      openQuestionnaire('url_fragment')
    }
  }, [])

  return (
    <div>
      {/* Navigation with tracking */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image src="/Logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-white text-lg font-normal">Levante</span>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('team')}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Team
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => openQuestionnaire('navbar')}
            className="text-white text-sm hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            Contribute
          </button>
        </div>

        <button 
          data-download-btn
          onClick={() => analytics.trackDownload('navbar')}
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer hover:bg-white/90 transition-colors"
        >
          Download
          <span>↓</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="relative min-h-[900px] rounded-2xl">
          {/* ... existing hero content ... */}
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <button 
              data-download-btn
              onClick={() => analytics.trackDownload('hero')}
              className="bg-white text-black rounded-full text-base font-medium flex items-center justify-center gap-2 w-[239px] h-[50px] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Download
              <span>↓</span>
            </button>
            <button
              onClick={() => openQuestionnaire('hero')}
              className="text-white text-base underline hover:no-underline transition-all cursor-pointer bg-transparent border-none"
            >
              Start contributing
            </button>
          </div>

          {/* Chat Demo with interaction tracking */}
          <div className="w-full max-w-[860px] px-4">
            <div 
              data-chat-demo
              className="rounded-2xl overflow-hidden shadow-2xl bg-white"
              onClick={() => analytics.track('chat_demo_interaction')}
            >
              <LandingChatDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with observation */}
      <section 
        id="features" 
        ref={featuresSection.ref}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 01 */}
          <div 
            className="relative rounded-xl overflow-hidden cursor-pointer"
            onClick={() => analytics.trackFeatureClick('mcp_store')}
          >
            {/* ... existing feature content ... */}
          </div>

          {/* Feature 02 */}
          <div 
            className="relative rounded-xl overflow-hidden cursor-pointer"
            onClick={() => analytics.trackFeatureClick('ai_models')}
          >
            {/* ... existing feature content ... */}
          </div>
        </div>
      </section>

      {/* Other sections with tracking */}
      <PartnersSection />
      <BuiltWithSection />
      
      <div ref={teamSection.ref}>
        <MeetTheTeamSection />
      </div>
      
      <div ref={aboutSection.ref}>
        <AboutSection />
      </div>

      <ContributeSection onOpenQuestionnaire={() => openQuestionnaire('contribute_section')} />
      <TryNowSection />

      <Questionnaire
        isOpen={isQuestionnaireOpen}
        onClose={closeQuestionnaire}
        onComplete={(responses) => {
          analytics.trackContribute('complete', { 
            responses: responses.length,
            completionTime: Date.now() 
          })
        }}
      />
    </div>
  );
}
```

### Step 8: Update Components

**File**: `src/components/TryNowSection.tsx`

```typescript
import Image from "next/image"
import { analytics } from "@/lib/analytics"

export const TryNowSection = () => {
  return (
    <footer className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center mt-16">
      {/* ... existing background ... */}

      <div className="relative z-10">
        <button 
          data-download-btn
          onClick={() => analytics.trackDownload('footer')}
          className="bg-white text-black px-10 py-4 rounded-full text-base font-medium hover:bg-gray-100 transition-colors cursor-pointer shadow-lg flex items-center gap-2"
        >
          Download
          <span>↓</span>
        </button>
      </div>
    </footer>
  )
}
```

**File**: `src/components/questionnaire.tsx` - Update with completion tracking

```typescript
// Add to form submission handler
const handleSubmit = async (formData: FormData) => {
  const startTime = Date.now()
  
  try {
    // ... existing submission logic ...
    
    // Track successful completion
    const responses = Array.from(formData.entries())
    analytics.trackContribute('complete', {
      responses: responses.length,
      completionTime: Date.now() - startTime
    })
    
    // Call parent completion handler
    onComplete?.(responses)
    
  } catch (error) {
    analytics.track('questionnaire_error', {
      error: error.message,
      step: 'submission'
    })
  }
}
```

## 📊 PostHog Dashboard Configuration

### Funnels to Create

1. **Download Funnel**
   ```
   Step 1: $pageview
   Step 2: section_view (features)
   Step 3: download_click
   Goal: >4% conversion
   ```

2. **Contribution Funnel**
   ```
   Step 1: $pageview
   Step 2: contribute_start
   Step 3: questionnaire_complete
   Goal: >15% completion
   ```

### Key Insights to Track

1. **Downloads by Source**
   - Event: download_click
   - Breakdown: utm_source
   - Visualization: Bar chart

2. **Feature Engagement**
   - Event: feature_interaction
   - Breakdown: feature_name
   - Visualization: Pie chart

3. **Scroll Engagement**
   - Event: scroll_depth
   - Filter: depth_percentage >= 75
   - Visualization: Line chart over time

### Cohorts to Create

1. **High-Intent Visitors**
   - Conditions: scroll_depth >= 75% AND section_view count >= 3

2. **Mobile Users**
   - Conditions: device_type = 'mobile'

3. **GitHub Traffic**
   - Conditions: utm_source = 'github'

## 🧪 Testing & Validation

### Test Events Locally

```typescript
// Add to development
if (process.env.NODE_ENV === 'development') {
  console.log('PostHog Event:', eventName, properties)
}
```

### Test URLs

```bash
# UTM tracking
http://localhost:3000?utm_source=test&utm_medium=dev&utm_campaign=implementation

# Fragment handling
http://localhost:3000#download
http://localhost:3000#contribute

# Combined
http://localhost:3000?utm_source=github&utm_campaign=launch#download
```

### Validation Checklist

- [ ] PostHog script loads correctly
- [ ] Page views tracked with UTM parameters
- [ ] Download events from all 3 buttons
- [ ] Contribution funnel (start → complete)
- [ ] Section view tracking
- [ ] Scroll depth milestones
- [ ] Feature interaction events
- [ ] Fragment navigation works
- [ ] Session recordings capturing
- [ ] No performance impact
- [ ] Mobile responsiveness maintained

---

**Implementation Time**: 2-3 days
**PostHog Setup**: 1 day
**Dashboard Config**: 1 day
**Total Launch Time**: 1 week

**PostHog es claramente superior a Umami para este proyecto - tendrás analytics de nivel enterprise con el plan gratuito.**