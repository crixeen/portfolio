# Guía de desarrollo

## Entorno local

```bash
pnpm install
pnpm dev
```

El servidor de desarrollo se ejecuta en `http://localhost:4321` (por defecto).

## Flujo de trabajo

### Añadir un proyecto

1. Edita `src/data/projects.json`
2. Añade un objeto con la estructura:

```json
{
  "id": "identificador-unico",
  "title": "Nombre del proyecto",
  "category": "Web App | Landing Page | CLI Tool | ...",
  "tags": ["tag1", "tag2", "tag3"],
  "cover": "/images/projects/nombre-cover.png",
  "coverClass": "ph-blue | ph-brown | ph-gray",
  "desc": "Descripción del proyecto.",
  "github": "https://github.com/...",
  "url": "https://demo.com",
  "gallery": ["/images/projects/nombre-1.png", "..."]
}
```

3. Coloca las imágenes en `public/images/projects/`

### Modificar el formulario de contacto

- **Campos**: Edita `src/components/Contact.astro` para añadir o quitar campos
- **Validación**: Ajusta `CONFIG.fields` y `RULES` en `src/js/formValidation.js`
- **Rate limit**: Modifica `CONFIG.rateLimit` en el mismo archivo

### Añadir o modificar estilos

Los estilos globales están en `public/css/global.css`. Variables CSS principales:

| Variable  | Uso                          |
|----------|-------------------------------|
| `--bg`   | Fondo principal               |
| `--bg2`  | Fondo secundario              |
| `--surface` | Superficies (cards, etc.) |
| `--accent`   | Color de acento            |
| `--text`     | Texto principal           |
| `--muted`    | Texto secundario          |

### Formatear código

```bash
pnpm format
```

## Estructura de componentes

Cada componente en `src/components/` es independiente. Se importan en `src/pages/index.astro` y se montan en orden. El layout (`Layout.astro`) envuelve todo el contenido.

## Scripts del cliente

- `formValidation.js`: Se carga en `Contact.astro` mediante `<script src="...">`
- `projects.js`: Se importa en `Projects.astro` desde el frontmatter (bundle de Astro)

## Convenciones

- Usar comillas simples en atributos HTML dentro de Astro
- Preferir clases CSS con nombres descriptivos (ej. `section-tag`, `form-input`)
- Mantener el idioma español en la UI y en comentarios internos relevantes
