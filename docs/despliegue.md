# Guía de despliegue

El proyecto está configurado para desplegarse en **Netlify**.

## Configuración actual

- **Adaptador**: `@astrojs/netlify` en `package.json`
- **Formularios**: Netlify Forms (`data-netlify="true"`) en el formulario de contacto
- **Honeypot**: Campo oculto `bot-field` para mitigar spam

## Despliegue en Netlify

### Opción 1: Conectar repositorio

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Conecta el repositorio Git del proyecto
3. Configura el build:
   - **Build command**: `pnpm run build` (o `npm run build`)
   - **Publish directory**: `dist`
   - **Base directory**: (dejar vacío si el proyecto está en la raíz)

4. Despliega. Netlify detectará automáticamente el adaptador `@astrojs/netlify`.

### Opción 2: Netlify CLI

```bash
pnpm add -D netlify-cli
pnpm build
netlify deploy --prod
```

### Opción 3: Arrastrar y soltar

1. Ejecuta `pnpm build`
2. En el panel de Netlify, arrastra la carpeta `dist/` generada

## Configuración del adaptador en Astro

Para usar Netlify con SSR o formularios, el `astro.config.mjs` puede incluir:

```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server', // o 'static' para sitio estático
  adapter: netlify(),
});
```

> **Nota**: Con `output: 'static'` (por defecto), el sitio se genera como estático y Netlify Forms sigue funcionando sin necesidad del adaptador explícito en la configuración. El paquete `@astrojs/netlify` está incluido para posibles funciones serverless futuras.

## Formulario de contacto

El formulario usa **Netlify Forms**. Tras el despliegue:

1. Entra en **Site configuration > Forms** en el panel de Netlify
2. Los envíos aparecerán ahí
3. El atributo `data-netlify-honeypot="bot-field"` añade un campo trampa para bots

## Variables de entorno

No se requieren variables de entorno para el funcionamiento básico. Si añades APIs o servicios externos, configúralas en **Site configuration > Environment variables** de Netlify.
