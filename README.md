# Cristian Josue · Portfolio Personal

Portfolio web personal de **Cristian Josue Encarnación Vicioso** (Crixen), desarrollador web full stack desde República Dominicana. Sitio estático construido con [Astro](https://astro.build) y optimizado para despliegue en Netlify.

---

## Descripción

Sitio de una sola página que presenta perfil profesional, habilidades, experiencia, proyectos destacados, reseñas y formulario de contacto. Diseño minimalista con tema oscuro, cursor personalizado y animaciones de revelado al hacer scroll.

## Características

- **Diseño responsivo** con tema oscuro
- **Cursor personalizado** interactivo
- **Animaciones de revelado** con `IntersectionObserver`
- **Formulario de contacto** con validación en cliente, honeypot anti-spam y rate limiting
- **Integración con Netlify Forms** para envío de mensajes
- **Lightbox y modal** para visualizar proyectos
- **Búsqueda y filtros** en galería de proyectos completa

---

## Requisitos

- **Node.js** 18+
- **pnpm** (recomendado) o npm / yarn

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd portfolio

# Instalar dependencias
pnpm install
```

## Scripts disponibles

| Comando        | Descripción                |
|----------------|----------------------------|
| `pnpm dev`     | Servidor de desarrollo     |
| `pnpm build`   | Compilar para producción   |
| `pnpm preview` | Vista previa del build     |
| `pnpm format`  | Formatear código con Prettier |

---

## Estructura del proyecto

```
portfolio/
├── public/           # Assets estáticos
│   ├── css/
│   ├── fonts/
│   ├── images/
│   └── pdf/
├── src/
│   ├── components/   # Componentes Astro
│   ├── data/        # Datos JSON (proyectos)
│   ├── js/          # Scripts (formValidation, projects)
│   ├── layouts/
│   └── pages/
├── docs/            # Documentación adicional
├── astro.config.mjs
└── package.json
```

Para una descripción detallada, consulta [docs/estructura.md](docs/estructura.md).

---

## Tecnologías

- **Astro** 5.x – Framework estático
- **@astrojs/netlify** – Adaptador de despliegue
- **Prettier** – Formato de código
- **Netlify Forms** – Envío del formulario de contacto

---

## Despliegue

El proyecto está preparado para Netlify. Consulta [docs/despliegue.md](docs/despliegue.md) para la guía de despliegue.

---

## Documentación adicional

- [Índice de documentación](docs/README.md)
- [CHANGELOG](docs/CHANGELOG.md) – Historial de cambios
- [Estructura del proyecto](docs/estructura.md)
- [Guía de despliegue](docs/despliegue.md)
- [Guía de desarrollo](docs/desarrollo.md)
- [Arquitectura y componentes](docs/arquitectura.md)

---

## Licencia

Proyecto personal. Todos los derechos reservados.
