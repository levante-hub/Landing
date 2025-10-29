# 📊 Plan de Medición y Analytics - Levante Landing

## Resumen Ejecutivo

Este documento define la estrategia completa de analytics para el landing page de Levante, enfocada en medir descargas de la aplicación, conversiones de contribuidores, y optimización de campañas en social media usando **PostHog** como herramienta principal de analytics.

## 🎯 Objetivos y KPIs

### North Star Metrics
- **Descargas de aplicación**: > 1,000 en primera semana
- **Rate de conversión**: > 4% overall
- **Contributors suscritos**: > 50 en primera semana
- **Tiempo en página**: > 3 minutos promedio

### KPIs Secundarios
- **Bounce rate**: < 40%
- **Scroll depth**: > 75% promedio
- **Mobile conversion**: Dentro del 80% de desktop
- **Diversificación de channels**: < 60% dependencia de una fuente

## 📈 Eventos de Tracking Definidos

### Eventos de Conversión
```javascript
// Download clicks
posthog.capture('download_click', {
  location: 'hero' | 'navbar' | 'footer',
  device: 'desktop' | 'mobile',
  utm_source: string,
  utm_campaign: string
});

// Contribución
posthog.capture('contribute_start', { 
  source: 'navbar' | 'hero' | 'contribute_section' 
});

posthog.capture('questionnaire_complete', { 
  responses: number 
});
```

### Eventos de Engagement
```javascript
// Navegación
posthog.capture('section_view', { 
  section: 'features' | 'team' | 'about' | 'partners' 
});

posthog.capture('scroll_depth', { 
  percentage: 25 | 50 | 75 | 100 
});

// Interacciones
posthog.capture('nav_click', { destination: string });
posthog.capture('feature_click', { feature: 'feature_01' | 'feature_02' });
posthog.capture('chat_demo_interaction');
```

### UTM Tracking
```javascript
posthog.capture('$pageview', {
  utm_source: string,
  utm_medium: string,
  utm_campaign: string,
  utm_content: string,
  fragment: string,
  referrer: string
});

// PostHog captura UTMs automáticamente
posthog.people.set({
  'utm_source': posthog.get_property('utm_source'),
  'utm_campaign': posthog.get_property('utm_campaign')
});
```

## 🔗 Sistema UTM para Campañas

### Templates por Plataforma

**Twitter/X**
```
https://levante-landing.com?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=main_post#download
```

**LinkedIn**
```
https://levante-landing.com?utm_source=linkedin&utm_medium=social&utm_campaign=launch&utm_content=company_post#features
```

**GitHub**
```
https://levante-landing.com?utm_source=github&utm_medium=referral&utm_campaign=opensource&utm_content=readme#contribute
```

**Product Hunt**
```
https://levante-landing.com?utm_source=producthunt&utm_medium=listing&utm_campaign=launch&utm_content=main_launch#download
```

**Discord Communities**
```
https://levante-landing.com?utm_source=discord&utm_medium=community&utm_campaign=mcp_discussion&utm_content=server_announcement#features
```

### Fragment Strategy
- `#download` → Auto-scroll to Download button + track intent
- `#features` → Highlight Features section
- `#contribute` → Open Questionnaire modal immediately  
- `#team` → Scroll to Team section
- `#demo` → Focus on Chat Demo interaction

## 📊 Dashboard de Métricas (PostHog Nativo)

### Vista Ejecutiva - Dashboard Principal
**PostHog incluye todo esto de forma nativa:**

```
┌─ CONVERSIONES HOY ──────────────────────┐
│ 📥 Downloads: XXX (+XX% vs ayer)        │
│ 🤝 Contributors: XX (+XX% vs ayer)      │
│ 👥 Unique Users: X,XXX (+XX%)           │
│ 💡 Conversion Rate: X.X% (+X.X%)        │
└─────────────────────────────────────────┘

┌─ TOP CHANNELS (Last 7 days) ──────────┐
│ 1. GitHub: XX% traffic, X.X% conv      │
│ 2. Twitter: XX% traffic, X.X% conv     │
│ 3. Direct: XX% traffic, X.X% conv      │
│ 4. LinkedIn: XX% traffic, X.X% conv    │
└───────────────────────────────────────┘

┌─ CONVERSION FUNNELS ───────────────────┐
│ Page View → Feature View → Download     │
│ 100% → 67% → 4.2% (conversion rate)    │
└─────────────────────────────────────────┘
```

### Features PostHog Incluye
- ✅ **Insights Dashboard**: Métricas en tiempo real
- ✅ **Funnels**: Download y contribution funnels
- ✅ **Retention**: User return analysis  
- ✅ **Cohorts**: Segmentación avanzada
- ✅ **Session Recordings**: Ver user behavior
- ✅ **Feature Flags**: A/B testing nativo

### Alertas Críticas
- Download rate drop > 20%
- Bounce rate > 60%
- Conversion by source < 2%
- Mobile conversion < Desktop -50%

## 🚀 Roadmap de Implementación

### Semana 1: Foundation
- [ ] Setup PostHog account + tracking script
- [ ] Implementar eventos básicos (download, contribute)
- [ ] UTM parameter capture automático
- [ ] Fragment handling básico

### Semana 2: Advanced Tracking  
- [ ] Session recordings setup
- [ ] Funnels de conversión
- [ ] Cohort analysis
- [ ] Feature flags para A/B testing

### Semana 3: Campaign Optimization
- [ ] Dashboard personalizado
- [ ] Alerts y notifications
- [ ] User segmentation avanzada
- [ ] Retention analysis

### Semana 4: Analysis & Iteration
- [ ] A/B testing de CTAs
- [ ] Weekly reports automation
- [ ] Performance optimization
- [ ] Scaling y growth hacking

## 🎯 Elementos a Trackear por Ubicación

### Botones de Download
- **Navbar**: `src/app/page.tsx:67-70`
- **Hero**: `src/app/page.tsx:105-108`  
- **Footer**: `src/components/TryNowSection.tsx:18-21`

### Navegación
- **Features**: `src/app/page.tsx:42-46`
- **Team**: `src/app/page.tsx:47-51`
- **About**: `src/app/page.tsx:54-57`
- **Contribute**: `src/app/page.tsx:60-63`

### Interacciones Especiales
- **Chat Demo**: `LandingChatDemo` component
- **Questionnaire**: `Questionnaire` component
- **Features cards**: `src/app/page.tsx:130-205`

## 📋 Pre-Launch Checklist

- [ ] Test todas las URLs con UTMs en diferentes devices
- [ ] Setup funnels en PostHog para cada conversion type
- [ ] Configurar dashboard ejecutivo en PostHog
- [ ] Preparar campaign assets con UTMs específicos
- [ ] Setup alerts y notifications
- [ ] Validar tracking en staging environment
- [ ] Configurar session recordings
- [ ] Setup feature flags para A/B testing

## 🔄 Post-Launch Optimization Strategy

### Week 1: Download Optimization
- Analizar friction points en conversion funnel
- Optimizar loading times y UX
- A/B test CTA positioning

### Week 2-4: Channel Performance
- Identificar top performing channels
- Optimizar campaigns con bajo ROI
- Escalar winning strategies

### Month 2: Conversion Optimization
- A/B test headlines y copy
- Personalización por source
- Advanced segmentation

### Month 3: Advanced Analytics
- Cohort analysis
- Predictive modeling
- Attribution modeling avanzado

---

**Última actualización**: ${new Date().toISOString().split('T')[0]}