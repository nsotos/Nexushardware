# AGENTS.md — Configuración del Agente para NexusHardware

## Descripción del Proyecto

**Nombre:** NexusHardware  
**Tipo:** E-commerce de componentes de computador  
**Contexto académico:** Trabajo Semestre 2 - 2026 — Asignatura: Desempeño de Sistemas — UTEM  
**Profesor:** j.aranda@utem.cl

### Temática
Tienda en línea especializada en componentes de computador de marcas reconocidas como:
- **ASUS** (tarjetas madre, tarjetas gráficas, monitores, laptops)
- **NVIDIA** (tarjetas gráficas, accesorios)
- **Kingston** (RAM, SSD, memorias flash)
- **AMD** (procesadores, tarjetas gráficas)
- **Corsair** (RAM, fuentes de poder, refrigeración, gabinetes)
- **Intel** (procesadores, SSD)
- **MSI** (tarjetas gráficas, tarjetas madre, laptops)
- **Samsung** (SSD, monitores)

---

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | Next.js (React) | UI del e-commerce, SSR/SSG para SEO y rendimiento |
| API / Backend | Node.js + Express | API REST que sirve datos al frontend |
| Base de datos | PostgreSQL | Persistencia de productos, usuarios, órdenes |
| ORM | Prisma | Mapeo objeto-relacional con PostgreSQL |
| Autenticación | NextAuth.js | Login/registro de usuarios |
| Pasarela de pago | Sandbox (Flow o Transbank) | Simulación de checkout sin pago real |
| Analítica | Google Analytics 4 (GA4) | Métricas de engagement y conversión |
| Pruebas de carga | k6 | Generadores de carga sintética |
| Control de versiones | Git + GitHub | Versionado periódico del código |
| Deployment | Vercel (frontend) + Railway o Render (API + BD) | Deploy en la nube con plan gratuito |
| Estilos | Vanilla CSS / CSS Modules | Estilos sin dependencias externas |

---

## Fases del Trabajo

### Fase 1.1 — Sitio E-commerce Funcional Mínimo
- Catálogo de productos con filtros y búsqueda
- Carrito de compras
- Flujo de checkout (simulado con sandbox)
- Registro e inicio de sesión de usuarios
- Al menos 3 páginas con distinta carga de datos: Home, Listado de productos, Detalle de producto
- Integración de Google Analytics 4 con eventos personalizados:
  - `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
  - Métricas de engagement (tiempo en página, tasa de rebote, páginas por sesión)
- Cuenta de GA4 compartida con: **j.aranda@utem.cl**

### Fase 1.2 — Generadores de Carga (Clientes Sintéticos)
- Scripts k6 que simulen múltiples usuarios concurrentes
- Comportamientos distintos: navegación, búsqueda, compra, abandono de carrito
- Parametrización: número de usuarios virtuales, ramp-up, duración, tasa de peticiones
- Tres escenarios:
  1. Carga baja
  2. Carga sostenida normal
  3. Carga pico / estrés

### Fase 2 — Análisis de Desempeño
- **Indicadores del servidor:** tiempo de respuesta (promedio, mediana, p90, p95, p99), throughput (req/s), tasa de error (4xx/5xx), utilización de CPU/RAM/I-O, punto de saturación
- **Indicadores de experiencia de usuario (GA4 + Web Vitals):** Core Web Vitals (LCP, FID/INP, CLS), tasa de rebote, duración de sesión, tasa de conversión del embudo
- Comparativa: condiciones normales vs. bajo carga generada
- Informe técnico con gráficos, análisis de cuellos de botella y propuestas de mejora
- Video pregrabado con todos los integrantes del grupo

---

## Reglas de Comportamiento del Agente

### 📋 Registro de sesión y prompts
1. **Al iniciar cada sesión**, leer el archivo `prompts.txt` para entender el contexto y el historial de lo que se ha construido hasta el momento.
2. **Después de cada prompt del usuario**, agregar una entrada en `prompts.txt` con:
   - Fecha y hora exacta
   - Prompt completo del usuario
   - Explicación resumida de lo que se hizo (instalaciones, diseño, código, etc.)
   - Modelo de IA utilizado en esa respuesta

### ✅ Siempre antes de implementar
3. **Explicar detalladamente** qué se va a hacer, en qué módulos o archivos fuente, y por qué, antes de escribir cualquier código.
4. **Solo implementar con la confirmación explícita del usuario.** Nunca actuar sin aprobación.

### 💬 Idioma y comunicación
5. Usar siempre **español neutro latinoamericano** en todas las respuestas, comentarios del código y documentación.
6. Mantener respuestas claras, concisas y bien estructuradas.

### 🧑‍💻 Calidad del código
7. **Documentar el código** con comentarios explicativos en cada función, módulo y lógica compleja.
8. **Proponer testing automático** (unitario o de integración) para cada pieza de código implementada.
9. **Compilar o ejecutar** los programas antes de terminar una sesión para validar que no haya errores de sintaxis o ejecución.

### 🔀 Control de versiones y despliegue
10. Al terminar cada modificación significativa, **preguntar al usuario**:
    - ¿Deseas hacer commit de esta versión? (y sugerir un mensaje de commit descriptivo)
    - ¿Deseas hacer deploy a producción?
11. Usar mensajes de commit descriptivos en español, siguiendo el formato: `tipo(ámbito): descripción` (ej: `feat(carrito): agregar lógica de descuentos`)

### 🧠 Expertise del agente para este proyecto
El agente debe actuar como experto en:
- Arquitecturas e-commerce modernas (Next.js, API REST, autenticación JWT/session)
- Diseño de bases de datos relacionales para e-commerce (productos, variantes, órdenes, usuarios)
- Integración de GA4 y Web Vitals en aplicaciones web
- Performance testing con k6 (scripts, escenarios, métricas)
- DevOps básico: deployment en Vercel, Railway o Render; variables de entorno; CI/CD
- Accesibilidad web y SEO técnico
- Seguridad básica en aplicaciones web (sanitización, autenticación, HTTPS)

---

## Estructura de Directorios Esperada

```
nexushardware/
├── frontend/              # Next.js app
│   ├── app/               # App Router de Next.js
│   ├── components/        # Componentes reutilizables
│   ├── public/            # Assets estáticos (imágenes, logos)
│   └── styles/            # CSS global y módulos
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── routes/        # Rutas de la API
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/     # Middlewares (auth, errores)
│   │   └── prisma/        # Schema y cliente Prisma
│   └── tests/             # Tests del backend
├── load-tests/            # Scripts k6 de generación de carga
├── docs/                  # Documentación e informes
├── prompts.txt            # Log de prompts y sesiones
├── AGENTS.md              # Este archivo
└── README.md              # Descripción general del proyecto
```

---

## Referencias del Trabajo

- **Enunciado completo:** `Trabajo Semestre 2 - 2026.pdf`  
- **Manual de Identidad Visual UTEM:** usar como referencia visual para el diseño
- **Repositorio Git:** a configurar (GitHub)
- **Herramienta de carga recomendada:** k6
- **Deployment:** Vercel (frontend) + Railway (API + PostgreSQL)
