# 📊 PostHog Dashboard Configuration Guide - Levante Analytics

## 🎯 Dashboard Setup Overview

PostHog ofrece dashboards nativos mucho más potentes que Umami. Esta guía te ayuda a configurar el dashboard ejecutivo perfecto para trackear el lanzamiento de Levante.

## 🏗️ Dashboard Principal - "Levante Executive Dashboard"

### 1. Crear Dashboard

1. **Ir a PostHog → Insights → Dashboards**
2. **Click "New Dashboard"**
3. **Nombre**: "Levante Executive Dashboard"
4. **Descripción**: "KPIs principales para landing page y conversiones"

### 2. Widgets Esenciales

#### 📈 **Widget 1: Conversiones Diarias**
```
Tipo: Insight
Evento: download_click
Visualization: Number
Timeframe: Last 24 hours
Compare: Previous period
Goal: Track daily downloads
```

#### 👥 **Widget 2: Visitantes Únicos**
```
Tipo: Insight  
Evento: $pageview (unique users)
Visualization: Number
Timeframe: Last 24 hours
Compare: Previous period
Goal: Track daily traffic
```

#### 🚀 **Widget 3: Conversion Rate**
```
Tipo: Funnel
Steps:
1. $pageview
2. download_click
Visualization: Conversion rate %
Timeframe: Last 7 days
Goal: Monitor overall conversion
```

#### 📊 **Widget 4: Downloads por Channel**
```
Tipo: Insight
Evento: download_click
Breakdown: utm_source
Visualization: Bar chart
Timeframe: Last 7 days
Goal: Identify best performing channels
```

#### 📱 **Widget 5: Mobile vs Desktop**
```
Tipo: Insight
Evento: download_click
Breakdown: device_type
Visualization: Pie chart
Timeframe: Last 30 days
Goal: Optimize for device preferences
```

#### 🎯 **Widget 6: Feature Engagement**
```
Tipo: Insight
Evento: feature_interaction
Breakdown: feature_name
Visualization: Bar chart
Timeframe: Last 7 days
Goal: See which features drive engagement
```

## 🔄 Funnels Configuration

### Funnel 1: Download Conversion

**Setup Steps:**
1. **Ir a Insights → New Insight → Funnels**
2. **Configurar steps:**
   ```
   Step 1: Event = $pageview
   Step 2: Event = section_view (features)
   Step 3: Event = download_click
   ```
3. **Filtros:**
   - Timeframe: Last 30 days
   - Breakdown: utm_source
4. **Nombre**: "Download Conversion Funnel"

**Métricas a monitorear:**
- Overall conversion: >4%
- GitHub traffic conversion: >6%
- Mobile conversion: Within 80% of desktop

### Funnel 2: Contribution Flow

**Setup Steps:**
1. **Crear nuevo funnel**
2. **Steps:**
   ```
   Step 1: Event = $pageview
   Step 2: Event = contribute_start
   Step 3: Event = questionnaire_complete
   ```
3. **Breakdown**: source
4. **Nombre**: "Contribution Funnel"

**Target**: >15% completion rate

## 📈 Key Insights Configuration

### Insight 1: Daily Downloads Trend

```json
{
  "insight_type": "trends",
  "events": [
    {
      "id": "download_click",
      "name": "download_click",
      "type": "events"
    }
  ],
  "interval": "day",
  "date_from": "-30d",
  "display": "ActionsLineGraph"
}
```

### Insight 2: UTM Source Performance

```json
{
  "insight_type": "trends", 
  "events": [
    {
      "id": "download_click",
      "name": "download_click",
      "type": "events"
    }
  ],
  "breakdown": "utm_source",
  "breakdown_type": "event",
  "display": "ActionsBar"
}
```

### Insight 3: Scroll Engagement

```json
{
  "insight_type": "trends",
  "events": [
    {
      "id": "scroll_depth",
      "name": "scroll_depth", 
      "type": "events",
      "properties": [
        {
          "key": "depth_percentage",
          "operator": "gte",
          "value": 75
        }
      ]
    }
  ],
  "breakdown": "depth_percentage"
}
```

## 🎨 Advanced Dashboard Widgets

### Widget 7: User Journey Map

```
Tipo: Paths
Starting point: $pageview
Timeframe: Last 7 days
Max steps: 5
Goal: Understand user flow through landing
```

### Widget 8: Session Duration

```
Tipo: Insight
Event: $pageview
Math: Average
Property: $session_duration
Visualization: Number
Timeframe: Last 30 days
Goal: Track engagement quality
```

### Widget 9: Geographic Distribution

```
Tipo: Insight
Event: $pageview (unique users)
Breakdown: $geoip_country_name
Visualization: World map
Timeframe: Last 30 days
Goal: Understand audience geography
```

### Widget 10: Real-time Activity

```
Tipo: Insight
Event: $pageview
Timeframe: Last 1 hour
Auto-refresh: Every 30 seconds
Goal: Monitor live activity during launches
```

## 🚨 Alerts Configuration

### Alert 1: Download Drop

1. **Ir a Insights → tu Download insight → More → Create alert**
2. **Configuración:**
   ```
   Metric: download_click count
   Condition: Decreases by more than 20%
   Timeframe: compared to previous day
   Check frequency: Every 2 hours
   Recipients: team@levante.com
   ```

### Alert 2: High Bounce Rate

```
Metric: Session duration average
Condition: Is below 90 seconds  
Timeframe: Last 4 hours
Check frequency: Every hour
Recipients: dev-team@levante.com
```

### Alert 3: Conversion Rate Drop

```
Metric: Download conversion rate
Condition: Decreases by more than 25%
Timeframe: compared to previous 7 days
Check frequency: Daily at 9 AM
Recipients: marketing@levante.com
```

## 🏷️ Cohorts Setup

### Cohort 1: High-Intent Visitors

**Conditions:**
```
Users who performed:
- scroll_depth (depth_percentage >= 75) 
AND
- section_view (count >= 3)
In the last 7 days
```

### Cohort 2: Mobile Users

**Conditions:**
```
Users who have property:
- device_type = "mobile"
In the last 30 days
```

### Cohort 3: GitHub Visitors

**Conditions:**
```
Users who have property:
- utm_source = "github"
In the last 30 days
```

### Cohort 4: Converted Users

**Conditions:**
```
Users who performed:
- download_click
In the last 90 days
```

## 📊 Reports & Automation

### Weekly Executive Report

**Setup:**
1. **Ir a Dashboard → More → Subscribe**
2. **Configuración:**
   ```
   Frequency: Weekly (Mondays 9 AM)
   Recipients: executives@levante.com
   Format: PDF + Email summary
   Include: All widgets del executive dashboard
   ```

### Daily Alerts Summary

**Email Template:**
```
Subject: Levante Daily Analytics - [DATE]

🎯 Key Metrics (vs yesterday):
- Downloads: [XX] ([+/-XX%])
- Unique Visitors: [X,XXX] ([+/-XX%]) 
- Conversion Rate: [X.X%] ([+/-X.X%])

📊 Top Channels:
1. [Source]: [XX%] traffic, [X.X%] conversion
2. [Source]: [XX%] traffic, [X.X%] conversion  

🚨 Alerts:
[Any active alerts or all clear]

📱 Mobile Performance: [XX%] of desktop conversion
```

## 🎛️ Session Recordings Setup

### Recording Configuration

1. **Ir a Settings → Project Settings → Recordings**
2. **Enable:**
   ```
   ✅ Record sessions automatically
   ✅ Record console logs
   ✅ Record network requests
   ✅ Record performance
   ```

3. **Filters:**
   ```
   Only record sessions where:
   - User performed download_click OR
   - User performed contribute_start OR  
   - Session duration > 2 minutes
   ```

### Useful Recording Playlists

1. **"Download Conversions"**
   - Filter: Sessions with download_click event
   - Goal: Understand conversion behavior

2. **"Mobile Users"**
   - Filter: device_type = "mobile"
   - Goal: Optimize mobile experience

3. **"Long Sessions"**
   - Filter: Session duration > 5 minutes
   - Goal: Understand engaged users

## 🎯 Feature Flags para A/B Testing

### Flag 1: CTA Button Text

```
Flag name: cta_button_text
Variants:
- Control: "Download" (50%)
- Variant A: "Get Levante" (25%)
- Variant B: "Try Free" (25%)

Tracking event: download_click
Property: feature_flag_variant
```

### Flag 2: Hero Headline

```
Flag name: hero_headline
Variants:
- Control: "Implement MCPs easily" (50%)
- Variant A: "Build AI Tools Faster" (50%)

Target audience: New visitors only
Duration: 2 weeks
```

### Flag 3: Questionnaire Position

```
Flag name: questionnaire_trigger
Variants:
- Control: On button click (70%)
- Variant A: Auto-popup after 30s (30%)

Success metric: questionnaire_complete rate
```

## 📱 Mobile-Specific Dashboard

### Mobile Performance Widget

```
Event: $pageview
Filter: device_type = "mobile" 
Breakdown: $current_url
Timeframe: Last 7 days
Goal: Monitor mobile traffic patterns
```

### Mobile Conversion Funnel

```
Same as main funnel but with filter:
device_type = "mobile"
Compare to: device_type = "desktop"
Goal: Ensure mobile parity
```

## 🔍 Debug & Testing

### Test Events in PostHog

1. **Live Events**: Ir a Activity → Live events
2. **Verify events**: Buscar por tu user ID o session
3. **Check properties**: Asegurar que UTMs se capturan

### Common Issues & Solutions

**Problem**: Events not appearing
- **Solution**: Check browser console for errors
- **Check**: PostHog key is correct in .env

**Problem**: UTM parameters missing
- **Solution**: Verify URLSearchParams implementation
- **Check**: Manual event capture vs autocapture

**Problem**: Dashboard showing no data
- **Solution**: Check date ranges and filters
- **Verify**: Events are being sent correctly

---

## 🎊 Launch Day Dashboard

### Special Launch Monitoring

**Create temporary dashboard "Launch Day Monitor":**

1. **Real-time visitors** (refresh every 30s)
2. **Downloads per hour** (last 24 hours)
3. **Traffic sources** (live breakdown)
4. **Error events** (any tracking issues)
5. **Mobile vs desktop** (real-time)
6. **Geographic spread** (where users coming from)

**Monitoring checklist:**
- [ ] All events firing correctly
- [ ] UTM tracking working
- [ ] No error spikes
- [ ] Mobile experience smooth
- [ ] Conversion rates within expected range

**PostHog Dashboard es 10x más potente que lo que tendrías que construir manualmente. Todo esto viene incluido en el plan gratuito con 1M eventos/mes.**