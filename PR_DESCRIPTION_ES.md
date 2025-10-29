## 🚀 Implementación de Analytics con PostHog

Implementa sistema completo de analytics para el landing page de Levante usando PostHog, incluyendo atribución de redes sociales y tracking de funnel de conversión.

### ✨ Funcionalidades Añadidas
- **Integración con PostHog** con controles basados en environment
- **Tracking de botones Download** en las 3 ubicaciones (navbar, hero, footer)
- **Captura de parámetros UTM** para atribución de redes sociales
- **Deep linking basado en fragmentos** (#download, #features, #contribute)
- **URLs de campañas sociales** listas para Twitter, LinkedIn, GitHub, etc.

### 📊 Eventos Trackeados
- `download_button_clicked` - Trackea descargas por ubicación
- `contribution_questionnaire_opened` - Trackea flujo de contribución
- `section_navigated` - Trackea engagement de navegación
- `traffic_source_visit` - Trackea atribución de redes sociales

### 🎯 Impacto de Negocio
- **Medir tasas de conversión** en diferentes canales
- **Optimizar CTAs** basado en datos de performance
- **Trackear ROI de redes sociales** con atribución UTM
- **Entender el journey del usuario** a través del landing page

### 🔧 Detalles Técnicos
- Control con flags de environment (`NEXT_PUBLIC_ENABLE_ANALYTICS`)
- Funciones de captura segura previenen errores
- Enriquecimiento automático de parámetros UTM
- Session storage para persistencia de atribución

🤖 Generado con [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>