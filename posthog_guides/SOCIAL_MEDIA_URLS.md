# 📱 URLs para Redes Sociales - Levante Landing

## 🔗 URLs Listas para Usar

### **Twitter/X**
```
https://levante-landing.com?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=main_post#download

https://levante-landing.com?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=features_tweet#features

https://levante-landing.com?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=contribute_tweet#contribute
```

### **LinkedIn**
```
https://levante-landing.com?utm_source=linkedin&utm_medium=social&utm_campaign=launch&utm_content=company_post#download

https://levante-landing.com?utm_source=linkedin&utm_medium=social&utm_campaign=launch&utm_content=personal_post#features

https://levante-landing.com?utm_source=linkedin&utm_medium=professional&utm_campaign=launch&utm_content=article#about
```

### **GitHub**
```
https://levante-landing.com?utm_source=github&utm_medium=referral&utm_campaign=opensource&utm_content=readme#download

https://levante-landing.com?utm_source=github&utm_medium=referral&utm_campaign=opensource&utm_content=profile#contribute

https://levante-landing.com?utm_source=github&utm_medium=community&utm_campaign=launch&utm_content=discussions#features
```

### **Product Hunt**
```
https://levante-landing.com?utm_source=producthunt&utm_medium=listing&utm_campaign=launch&utm_content=main_launch#download

https://levante-landing.com?utm_source=producthunt&utm_medium=listing&utm_campaign=launch&utm_content=maker_comment#features
```

### **Discord**
```
https://levante-landing.com?utm_source=discord&utm_medium=community&utm_campaign=mcp_discussion&utm_content=server_announcement#features

https://levante-landing.com?utm_source=discord&utm_medium=community&utm_campaign=mcp_discussion&utm_content=help_channel#contribute

https://levante-landing.com?utm_source=discord&utm_medium=community&utm_campaign=beta_testing&utm_content=beta_invite#download
```

### **Reddit**
```
https://levante-landing.com?utm_source=reddit&utm_medium=social&utm_campaign=launch&utm_content=r_programming#download

https://levante-landing.com?utm_source=reddit&utm_medium=social&utm_campaign=launch&utm_content=r_opensource#contribute

https://levante-landing.com?utm_source=reddit&utm_medium=social&utm_campaign=launch&utm_content=r_ai#features
```

### **YouTube**
```
https://levante-landing.com?utm_source=youtube&utm_medium=video&utm_campaign=demo&utm_content=description#demo

https://levante-landing.com?utm_source=youtube&utm_medium=video&utm_campaign=tutorial&utm_content=comments#download
```

### **Hacker News**
```
https://levante-landing.com?utm_source=hackernews&utm_medium=social&utm_campaign=show_hn&utm_content=main_post#download

https://levante-landing.com?utm_source=hackernews&utm_medium=social&utm_campaign=show_hn&utm_content=comments#features
```

### **Dev.to**
```
https://levante-landing.com?utm_source=devto&utm_medium=article&utm_campaign=tutorial&utm_content=mcp_guide#contribute

https://levante-landing.com?utm_source=devto&utm_medium=article&utm_campaign=launch&utm_content=announcement#download
```

## 🎯 Fragmentos de Acción

### **#download**
- Auto-scroll a botón Download principal
- Destaca visualmente el CTA
- Trackea intent de descarga desde social media

### **#features**  
- Scroll a sección de features
- Ideal para posts explicando funcionalidades
- Trackea interés en características del producto

### **#contribute**
- Abre modal de cuestionario inmediatamente  
- Perfecto para posts sobre open source
- Trackea conversión a contribuidor

### **#team**
- Scroll a sección del equipo
- Para posts sobre la empresa/founders
- Trackea interés en el equipo

### **#demo**
- Focus en chat demo interactivo
- Para videos/tutoriales
- Trackea engagement con producto

## 📊 Tracking Automático

Cada URL trackeará automáticamente:

```javascript
// Page view con attribution
{
  event: '$pageview',
  utm_source: 'twitter',
  utm_medium: 'social', 
  utm_campaign: 'launch',
  utm_content: 'main_post',
  fragment: 'download'
}

// Traffic source visit
{
  event: 'traffic_source_visit',
  source: 'twitter',
  medium: 'social',
  campaign: 'launch'
}

// Download intent (si fragment = #download)
{
  event: 'download_intent_from_social',
  source: 'twitter',
  fragment: 'download'
}
```

## 🎨 Posts Sugeridos por Red Social

### **Twitter/X**
```
🚀 Just launched Levante - the easiest way to implement MCPs! 

✨ Add custom MCPs to your workflow
🔧 Import directly from our Store  
🤖 Works with 100+ AI models

Try it now: [URL con #download]

#AI #OpenSource #MCP #Developers
```

### **LinkedIn**
```
Excited to share Levante with the professional community! 

We're democratizing Model Context Protocols to help developers build better AI tools faster.

Key features:
→ Custom MCP integration
→ Marketplace of ready-to-use MCPs  
→ Multi-provider AI model support

Check it out: [URL con #features]

#AITools #Productivity #OpenSource
```

### **GitHub**
```
# README.md mention
Looking for an easy way to implement MCPs? Check out [Levante](URL con #contribute) - we're building the future of AI tool integration!

Contributions welcome! Join our mission: [URL con #contribute]
```

### **Product Hunt** 
```
🎯 We're live on Product Hunt!

Levante makes MCP implementation effortless. Join the open-source revolution: [URL con #download]

Your support means everything! 🙏
```

## 🔍 Testing URLs

Para probar localmente, usa:
```
http://localhost:3000?utm_source=twitter&utm_medium=social&utm_campaign=test&utm_content=local_test#download
```

Deberías ver en PostHog:
- Page view con UTM parameters
- Traffic source visit event  
- Download intent from social event

## 📈 Métricas a Monitorear

### **Por Red Social:**
- Visitantes únicos
- Tasa de conversión a download
- Tiempo en página
- Bounce rate

### **Por Campaign:**
- Performance de diferentes posts
- Mejores horarios de publicación
- Engagement por tipo de contenido

### **Por Fragment:**
- #download: Conversión directa
- #features: Engagement con producto
- #contribute: Conversión a colaborador

**¡Ahora tienes tracking completo de todas las redes sociales con attribution perfecta!**