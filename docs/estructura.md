# Estructura del proyecto

## Árbol de directorios

```
portfolio/
├── public/                    # Archivos estáticos servidos directamente
│   ├── css/
│   │   ├── global.css         # Estilos globales, variables CSS, componentes
│   │   └── fonts.css         # Definición de fuentes (Instrument Sans)
│   ├── fonts/                # Archivos de fuentes
│   ├── images/               # Imágenes (proyectos, assets)
│   └── pdf/                  # CV en PDF
│
├── src/
│   ├── components/            # Componentes Astro
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   ├── Cursor.astro
│   │   ├── Experience.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   ├── Projects.astro
│   │   ├── RevealObserver.astro
│   │   ├── Reviews.astro
│   │   └── Skills.astro
│   │
│   ├── data/
│   │   └── projects.json     # Datos de proyectos (título, descripción, tags, etc.)
│   │
│   ├── js/
│   │   ├── formValidation.js # Validación del formulario de contacto
│   │   └── projects.js      # Re-exporta PROJECTS desde projects.json
│   │
│   ├── layouts/
│   │   └── Layout.astro      # Layout principal (HTML, head, meta)
│   │
│   └── pages/
│       └── index.astro       # Página principal (composición de componentes)
│
├── docs/                     # Documentación
│   ├── CHANGELOG.md
│   ├── arquitectura.md
│   ├── despliegue.md
│   ├── desarrollo.md
│   └── estructura.md
│
├── .astro/                   # Generado por Astro
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Descripción de carpetas clave

### `public/`
Contenido estático que se copia tal cual al output. Las rutas no incluyen `/public`: `/css/global.css` apunta a `public/css/global.css`.

### `src/components/`
Componentes reutilizables en formato Astro. Cada uno representa una sección o elemento de la UI.

### `src/data/`
Archivos JSON con datos estáticos. `projects.json` define los proyectos mostrados en la galería.

### `src/js/`
Scripts JavaScript utilizados en el cliente. Se incluyen mediante `<script src="...">` en los componentes.
