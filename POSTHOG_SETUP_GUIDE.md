# 🚀 PostHog Setup Guide - Levante Analytics

## 📋 Configuración Inicial PostHog

### Step 1: Crear Cuenta PostHog

1. **Ir a [posthog.com](https://posthog.com)**
2. **Sign up** con email o GitHub
3. **Seleccionar "Product Analytics"** como use case principal
4. **Crear organization**: "Levante"

### Step 2: Configurar Proyecto

```
Project Name: Levante Landing
Website URL: https://levante-landing.com (o tu dominio)
Industry: Developer Tools
Company size: Startup (1-10 people)
```

### Step 3: Obtener API Key

1. **Ir a Settings → Project Settings**
2. **Copiar "Project API Key"**
3. **Añadir a `.env.local`:**

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_tu_project_key_aqui
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## ⚙️ Configuración de Proyecto

### Basic Settings

1. **Ir a Settings → Project Settings → General**
2. **Configurar:**
   ```
   Timezone: America/Argentina/Buenos_Aires
   Currency: USD (para revenue tracking futuro)
   Data retention: 7 years (free tier)
   ```

### Privacy & Compliance

1. **Ir a Settings → Project Settings → Privacy**
2. **Configurar:**
   ```
   ✅ Respect Do Not Track
   ✅ IP address masking
   ❌ Recording on sensitive domains (no needed)
   ✅ Capture performance events
   ```

### Data Capture Settings

1. **Ir a Settings → Data Management → Properties**
2. **Block unnecessary properties:**
   ```
   $user_agent (too much noise)
   $referrer (we track utm_source instead)
   ```

3. **Important properties to keep:**
   ```
   ✅ utm_source, utm_medium, utm_campaign
   ✅ device_type, screen_width
   ✅ $current_url, $pathname
   ✅ All custom event properties
   ```

## 🎯 Events Configuration

### Auto-Capture Settings

1. **Ir a Settings → Project Settings → Auto-capture**
2. **Enable:**
   ```
   ✅ Page views ($pageview)
   ✅ Clicks on buttons and links
   ✅ Form submissions
   ✅ Text selection (useful for engagement)
   ```

3. **Disable:**
   ```
   ❌ Mouse movements (too noisy)
   ❌ All clicks (we'll track specific ones)
   ```

### Custom Events Setup

**Events we'll track manually:**
- ✅ `download_click`
- ✅ `contribute_start`
- ✅ `questionnaire_complete`
- ✅ `section_view`
- ✅ `scroll_depth`
- ✅ `feature_interaction`
- ✅ `navigation`

## 📊 Dashboard Inicial

### Default Dashboard Creation

1. **Ir a Insights → Dashboards**
2. **Create "Levante Overview Dashboard"**
3. **Add initial widgets:**

#### Widget 1: Page Views (Last 7 days)
```
Insight Type: Trends
Event: $pageview
Visualization: Line chart
Date range: Last 7 days
```

#### Widget 2: Unique Users
```
Insight Type: Trends  
Event: $pageview (unique users)
Visualization: Number
Date range: Last 24 hours
Compare to: Previous period
```

#### Widget 3: Top Pages
```
Insight Type: Trends
Event: $pageview
Breakdown: $current_url
Visualization: Table
Date range: Last 7 days
```

## 🔄 Funnels Setup

### Primary Conversion Funnel

1. **Ir a Insights → New Insight → Funnels**
2. **Create "Download Funnel":**
   ```
   Step 1: $pageview
   Step 2: section_view (where section_name = "features")
   Step 3: download_click
   
   Time frame: 30 minutes
   Date range: Last 30 days
   ```

### Secondary Funnel - Contribution

```
Step 1: $pageview  
Step 2: contribute_start
Step 3: questionnaire_complete

Time frame: 1 hour
Date range: Last 30 days
```

## 🎛️ Session Recordings

### Recording Configuration

1. **Ir a Settings → Project Settings → Session Recordings**
2. **Configure:**
   ```
   ✅ Enable session recordings
   Sample rate: 100% (free tier allows this)
   Minimum duration: 10 seconds
   ```

3. **Recording filters:**
   ```
   Record sessions where:
   - Event = download_click OR
   - Event = contribute_start OR
   - Session duration > 120 seconds
   ```

4. **Privacy settings:**
   ```
   ✅ Mask sensitive elements
   ✅ Mask all text inputs (forms)
   ❌ Mask all text (we want to see landing copy)
   ```

## 👥 User Identification

### Anonymous Users

Por defecto PostHog trackea users anónimos con device fingerprinting.

### Identified Users (Future)

Cuando tengamos auth en la app:
```typescript
posthog.identify('user_id', {
  email: 'user@example.com',
  plan: 'free',
  signup_date: '2024-01-01'
})
```

## 🌍 Geographic & Device Tracking

### Automatic Properties

PostHog captura automáticamente:
- ✅ `$geoip_country_name`
- ✅ `$geoip_city_name` 
- ✅ `$browser`, `$os`
- ✅ `$device_type` (mobile/desktop)
- ✅ `$screen_height`, `$screen_width`

### Custom Device Tracking

En nuestro código añadimos:
```typescript
// Enhanced device detection
posthog.people.set({
  device_category: window.innerWidth < 768 ? 'mobile' : 'desktop',
  screen_resolution: `${window.screen.width}x${window.screen.height}`,
  user_agent: navigator.userAgent
})
```

## 🚨 Alerts & Notifications

### Slack Integration

1. **Ir a Settings → Integrations → Slack**
2. **Connect workspace**
3. **Configure channel**: `#levante-analytics`

### Email Alerts

1. **Ir a any Insight → More → Create Alert**
2. **Download drop alert:**
   ```
   Metric: download_click (count)
   Condition: Decreases by more than 20%
   Time comparison: Previous day
   Check frequency: Every 2 hours
   ```

3. **Traffic spike alert:**
   ```
   Metric: $pageview (count)
   Condition: Increases by more than 200%
   Time comparison: Previous day  
   Check frequency: Every hour
   ```

## 📱 Mobile Testing

### Mobile-Specific Setup

1. **Test on real devices**
2. **Verify events fire correctly**
3. **Check session recordings quality**

### Mobile Dashboard

Create separate dashboard for mobile analytics:
- Mobile traffic trends
- Mobile conversion rates
- Mobile vs desktop performance
- Mobile-specific user journeys

## 🧪 Testing & Validation

### Test Events in Development

```typescript
// Debug mode for development
if (process.env.NODE_ENV === 'development') {
  posthog.debug() // Enables console logging
}
```

### Validation Steps

1. **Live Events Check:**
   - Ir a Activity → Live Events
   - Perform actions on localhost:3000
   - Verify events appear in real-time

2. **Properties Validation:**
   - Check UTM parameters captured
   - Verify custom properties present
   - Confirm device detection working

3. **Funnel Testing:**
   - Complete full download flow
   - Check funnel shows progression
   - Verify timing is reasonable

## 📈 Growth Tracking Setup

### UTM Campaign Tracking

**Pre-configure UTM values:**
1. **Ir to Data Management → Properties**
2. **Add expected values:**
   ```
   utm_source: github, twitter, linkedin, producthunt, discord
   utm_medium: social, referral, listing, community
   utm_campaign: launch, beta, general
   ```

### A/B Testing Preparation

1. **Ir to Feature Flags**
2. **Create test flag:**
   ```
   Flag key: test_flag
   Name: Test Flag
   Description: Testing PostHog integration
   Rollout: 100%
   ```

3. **Test in code:**
   ```typescript
   if (posthog.isFeatureEnabled('test_flag')) {
     console.log('Feature flags working!')
   }
   ```

## 🎨 Custom Dashboard Templates

### Executive Summary Template

**Widgets to include:**
1. Key metrics (downloads, visitors, conversion)
2. Traffic sources breakdown
3. Geographic distribution
4. Device split
5. Conversion funnels
6. Real-time activity

### Marketing Performance Template

**Widgets to include:**
1. UTM source performance
2. Campaign ROI (when we have revenue)
3. Conversion by channel
4. User journey paths
5. Retention cohorts

### Product Analytics Template

**Widgets to include:**
1. Feature interaction rates
2. User flow through landing
3. Session duration distribution
4. Scroll depth analysis
5. Error tracking
6. Mobile vs desktop behavior

## 🔒 Security & Privacy

### Data Export Controls

1. **Ir to Settings → Data Management**
2. **Configure:**
   ```
   ✅ Allow CSV export
   ✅ Allow API access
   ❌ Allow full data export (not needed)
   ```

### Team Access

1. **Ir to Settings → Members**
2. **Add team members:**
   ```
   Developers: Admin access
   Marketing: Editor access  
   Stakeholders: Viewer access
   ```

## 📋 Launch Checklist

### Pre-Launch (1 week before)

- [ ] PostHog account created and configured
- [ ] API keys added to production environment
- [ ] All events tested in staging
- [ ] Funnels created and validated
- [ ] Dashboard configured
- [ ] Session recordings enabled
- [ ] Alerts set up
- [ ] Team access configured

### Launch Day

- [ ] Monitor live events dashboard
- [ ] Check funnel conversion rates
- [ ] Verify UTM tracking from campaigns
- [ ] Monitor for any error events
- [ ] Watch session recordings for UX issues

### Post-Launch (Week 1)

- [ ] Daily metric reviews
- [ ] UTM campaign optimization
- [ ] A/B test setup for improvements
- [ ] Weekly reports to stakeholders
- [ ] Funnel optimization based on data

## 🚀 Advanced Features (Month 2+)

### Revenue Tracking

When we have pricing:
```typescript
posthog.capture('purchase', {
  revenue: 29.99,
  currency: 'USD',
  plan: 'pro'
})
```

### Cohort Analysis

Track user behavior over time:
- Weekly cohorts
- Retention analysis
- Feature adoption curves

### Advanced Segmentation

- Power users (high engagement)
- Churned visitors (one-time visits)
- Converting vs non-converting traffic

---

## 💡 Pro Tips

1. **Start simple**: Get basic tracking working first, add complexity later
2. **Focus on conversions**: Downloads and contributions are what matter
3. **Mobile-first**: Ensure mobile tracking is perfect
4. **Regular reviews**: Check dashboards daily during launch period
5. **Iterate quickly**: Use data to optimize CTAs, copy, and flow

**PostHog free tier (1M events/mes) será más que suficiente para los primeros meses. Es una plataforma enterprise-grade que escalará con Levante.**