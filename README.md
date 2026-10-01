# Consulado General del Perú en Miami — Sitio web

Aplicación React de una sola página. Sin backend, sin base de datos y sin costo:
se publica sola en GitHub Pages con cada push a `main`.

## Stack

| Pieza | Para qué |
|---|---|
| React 19 + Vite | Base de la aplicación y build |
| Tailwind CSS 4 | Estilos, con los colores institucionales como tokens |
| Zustand | Estado compartido: categoría abierta, requisitos leídos, modal |
| Framer Motion | Animaciones de apertura, modal y transiciones |
| React Router (hash) | Rutas internas |

### Por qué rutas con `#`

GitHub Pages solo sirve archivos; no sabe reescribir rutas. Con rutas normales,
recargar `/tramites` daría 404. El modo hash (`/#/tramites`) lo resuelve sin
servidor ni configuración.

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Logo, contacto, los dos botones y las noticias |
| `/#/tramites` | Las 8 categorías con sus 24 trámites |
| `/#/tramite/:id` | Requisitos, pasos, costo, checkbox y acceso a la cita |
| `/#/estado` | Consulta del estado por número de DNI |

## El flujo de citas

Nadie llega al sistema de reservas sin pasar por los requisitos de su trámite:

1. "Haz tu cita" en el inicio lleva al índice de trámites, no al calendario.
2. Se elige el trámite y se leen requisitos, pasos y costo.
3. El botón de cita está deshabilitado hasta marcar "Leí todos los requisitos".
4. Al presionarlo aparece un aviso sobre la documentación del día de la cita.
5. Solo al confirmar se abre el sistema de reservas.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # revisa el build
```

## Publicar

1. Subir el repositorio a GitHub (público).
2. Settings → Pages → Source: **GitHub Actions**.
3. Cada push a `main` compila y publica solo.

### ⚠️ Antes del primer push: cambiar el dominio

Los meta tags de Open Graph necesitan URLs absolutas o WhatsApp y Facebook no
mostrarán la imagen al compartir el enlace. Reemplazar
`https://consulado-peru-miami.pages.dev` en `index.html`, `public/robots.txt`
y `public/sitemap.xml`.

## Dónde está el contenido

Todo vive en `src/data/`, separado de los componentes:

- `tramites.json` — las 8 categorías y los 24 trámites
- `iconos.json` — los paths SVG de cada icono
- `noticias.json` — las 4 tarjetas del carrusel
- `estado.json` — **datos de prueba** de la consulta de trámites

### Agregar un trámite

Añadir un objeto al array `tramites` de su categoría en `tramites.json`:

```json
{
  "id": "slug-unico-sin-tildes",
  "nombre": "Nombre del trámite",
  "icono": "pasaporte",
  "intro": "Para qué sirve y a quién aplica.",
  "costo": "US$ 25.00",
  "requisitos": ["<b>Documento:</b> descripción."],
  "pasos": [{ "titulo": "Saca tu cita", "detalle": "Qué hacer." }],
  "alerta": "Texto del recuadro rojo, o null.",
  "url": "https://www.gob.pe/00000",
  "citaEmail": null,
  "citaExterna": null
}
```

El contador de la categoría se calcula solo. El valor de `icono` debe existir
en `iconos.json`.

Si el trámite no usa el sistema de citas normal: `citaEmail` abre un correo
con el asunto listo y `citaExterna` lleva a otra plataforma. Ambos pasan igual
por el checkbox y el aviso.

### Cambiar los costos

Los montos están en dólares. La tarifa oficial se fija en soles consulares,
equivalentes aproximadamente a un dólar. Si el tipo de cambio se mueve, hay que
actualizarlos en `tramites.json`.

## Pendiente para producción

`estado.json` son datos de prueba dentro del JavaScript: cualquiera puede verlos
en el código fuente. Antes de usar datos reales hay que moverlos a Supabase con
Row Level Security, y pedir dos datos para buscar (DNI más apellido, por ejemplo)
para que nadie pueda recorrer números de documento y cosechar nombres.
