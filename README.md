# Consulado General del Perú en Miami — Sitio web

Sitio estático de dos páginas. Sin frameworks, sin build, sin dependencias.

## Estructura

```
.
├── index.html              Página principal: noticias, botones y 24 trámites
├── tramites.html           Consulta del estado de trámite (DNI / Pasaporte)
├── favicon.ico             Favicon multi-resolución (16/32/48)
├── site.webmanifest        Manifest para instalar como app
├── robots.txt              Indexación para buscadores
├── sitemap.xml             Mapa del sitio
├── .nojekyll               Evita que GitHub Pages procese con Jekyll
└── assets/
    ├── logo.png                    Logo institucional (1671×362)
    ├── icons/                      Favicons, iconos de app e imagen de compartir
    │   ├── favicon-16.png
    │   ├── favicon-32.png
    │   ├── favicon-48.png
    │   ├── favicon-96.png
    │   ├── apple-touch-icon.png    180×180, para iPhone
    │   ├── icon-192.png            Android
    │   ├── icon-512.png            Android
    │   ├── icon-512-maskable.png   Android con recorte circular
    │   └── og-image.png            1200×630, vista previa al compartir
    └── noticias/                   4 imágenes del carrusel (800×800)
```

## ⚠️ Antes de publicar: cambiar el dominio

Los meta tags de Open Graph exigen URLs absolutas. Si no se cambian,
WhatsApp y Facebook no mostrarán la imagen al compartir el enlace.

Reemplazar `https://consulado-peru-miami.pages.dev` por el dominio real en:

- `index.html` (3 veces: canonical, og:url, og:image y twitter:image)
- `tramites.html` (3 veces)
- `robots.txt` (1 vez)
- `sitemap.xml` (2 veces)

En Linux o Mac, desde la carpeta del proyecto:

```bash
grep -rl "consulado-peru-miami.pages.dev" . | \
  xargs sed -i 's|https://consulado-peru-miami.pages.dev|https://TU-DOMINIO.com|g'
```

## Publicar en GitHub Pages

1. Crear un repositorio público y subir todo el contenido de esta carpeta
   a la raíz (no dentro de una subcarpeta).
2. Settings → Pages → Source: Deploy from a branch.
3. Branch: `main`, carpeta `/ (root)`. Guardar.
4. La URL será `https://USUARIO.github.io/NOMBRE-REPO/`.

> Si el sitio queda en un subdirectorio (`/NOMBRE-REPO/`), las rutas
> relativas de assets funcionan igual, pero el dominio de los meta tags
> debe incluir esa ruta.

## Publicar en Cloudflare Pages

1. Conectar el repositorio de GitHub.
2. Build command: *(dejar vacío)*
3. Build output directory: `/`
4. Dominio gratuito: `nombre-proyecto.pages.dev`

## Mantenimiento

**Agregar un trámite:** duplicar un bloque `<div class="tram-item">` dentro
de la categoría que corresponda en `index.html` y ajustar el contador
`<span class="cat-count">`.

**Cambiar una noticia:** reemplazar la imagen en `assets/noticias/`
(debe ser cuadrada, 800×800) y editar el texto del `<p class="noticia-texto">`.

**Base de datos de trámites:** `tramites.html` usa datos de prueba en un
array JS. Para producción hay que conectarlo a una API o base de datos real.

## Costos

Los montos se muestran en dólares. La tarifa oficial está fijada en soles
consulares, equivalentes aproximadamente a un dólar. Si el tipo de cambio
varía, los montos deben actualizarse a mano en `index.html`.
