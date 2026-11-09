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

### 📋 Registro de sesión y prompts (PRIORIDAD MÁXIMA — BITÁCORA UNIFICADA)
1. **Prioridad Absoluta**: Cada vez que se implemente una modificación de código, instalación, arquitectura o migración, el registro en `prompts.txt` **debe realizarse de forma obligatoria e inmediata en el mismo turno**. Nunca debe responderse al usuario habiendo aplicado cambios sin haber actualizado previamente `prompts.txt`.
2. **Bitácora Única y Equitativa del Equipo**:
   - Todo el equipo comparte un único archivo central: `prompts.txt`.
   - **Registro por Hitos Funcionales**: Para asegurar equilibrio y equidad entre todos los integrantes, solo se registran bloques o hitos completos (features, migraciones, nuevos módulos). No se registran consultas, dudas ni micro-iteraciones cosméticas.
   - Si ocurre un conflicto de Git en `prompts.txt` (append-only), se resuelven aceptando ambos bloques de forma secuencial.
3. **Al iniciar cada sesión**, el agente debe leer `prompts.txt` para entender el contexto acumulado por todos los integrantes del equipo.
4. **Formato obligatorio de cada entrada**:
   - Fecha y hora exacta (UTC-3)
   - Modelo de IA utilizado
   - Prompt representativo del hito
   - Explicación detallada de lo que se implementó (archivos creados, diseño y testing)


### ✅ Siempre antes de implementar
4. **Explicar detalladamente** qué se va a hacer, en qué módulos o archivos fuente, y por qué, antes de escribir cualquier código.
5. **Solo implementar con la confirmación explícita del usuario.** Nunca actuar sin aprobación.

### 💬 Idioma y comunicación
6. Usar siempre **español neutro latinoamericano** en todas las respuestas, comentarios del código y documentación.
7. Mantener respuestas claras, concisas y bien estructuradas.

### 🧑‍💻 Calidad del código
8. **Documentar el código** con comentarios explicativos en cada función, módulo y lógica compleja.
9. **Proponer testing automático** (unitario o de integración) para cada pieza de código implementada.
10. **Compilar o ejecutar** los programas antes de terminar una sesión para validar que no haya errores de sintaxis o ejecución.

### 🔀 Control de versiones y despliegue
11. **Git es manejado exclusivamente por el usuario**: El usuario gestiona el control de versiones (vía GitKraken u otra herramienta). Los agentes **NUNCA** deben ejecutar comandos de Git para crear commits, hacer push o modificar el repositorio, ni realizar deploys.
12. De manera opcional, el agente puede sugerir un mensaje de commit descriptivo en español siguiendo el formato `tipo(ámbito): descripción` para facilitarle el registro al usuario, pero la acción es 100% manual del usuario.

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
