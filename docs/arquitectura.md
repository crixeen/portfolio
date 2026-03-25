# Arquitectura y componentes

## Flujo general

```
Layout.astro (HTML base, meta, estilos)
  └── index.astro (composición)
        ├── Cursor (cursor personalizado)
        ├── Navbar (navegación)
        ├── Hero (presentación)
        ├── About (sobre mí)
        ├── Skills (habilidades)
        ├── Experience (trayectoria)
        ├── Projects (galería de proyectos)
        ├── Reviews (reseñas)
        ├── Contact (formulario)
        ├── Footer
        └── RevealObserver (animaciones al scroll)
```

## Componentes principales

### Layout.astro
- Define `<!DOCTYPE html>`, head, meta tags
- Carga `global.css` y `fonts.css`
- Renderiza `<slot />` para el contenido de las páginas
- Props: `title` (título de la página)

### Navbar
- Navegación fija con links a secciones (#about, #skills, etc.)
- Clase `scrolled` aplicada al hacer scroll para cambiar estilo

### Hero
- Presentación principal
- Calcula años de experiencia con JavaScript (desde Nov 2024)
- Links a proyectos y descarga de CV

### Contact
- Formulario con Netlify Forms
- Honeypot `bot-field`
- Incluye `formValidation.js` para validación en cliente

### Projects
- Importa datos desde `src/js/projects.js` (que a su vez lee `projects.json`)
- Muestra proyecto destacado + grid de proyectos adicionales
- Lightbox para imágenes
- Modal para detalles
- Overlay "Ver todos" con búsqueda y filtros por tags

### RevealObserver
- Usa `IntersectionObserver` para añadir clase `visible` a elementos con `.reveal`
- Configuración: `threshold: 0.08`, `rootMargin` inferior

### Cursor
- Cursor personalizado que sigue al puntero
- Anillos y estados interactivos (hover sobre enlaces)

## Validación del formulario (formValidation.js)

- **Campos**: nombre, empresa, email, asunto, mensaje
- **Reglas**: longitud mínima/máxima, formato email, sin HTML, sin palabras prohibidas
- **Rate limit**: 3 intentos por minuto
- **Honeypot**: detecta bots
- **Pegado bloqueado** en el campo email
- **Dominios desechables** rechazados (tempmail, etc.)

## Datos

Los proyectos se definen en `src/data/projects.json`. El archivo `projects.js` re-exporta el array como `PROJECTS` para importación en componentes Astro.
