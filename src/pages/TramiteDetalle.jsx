import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import categorias from '../data/tramites.json'
import { useStore } from '../store'
import Icono from '../components/Icono'

function buscar(id) {
  for (const c of categorias) {
    const t = c.tramites.find((x) => x.id === id)
    if (t) return { tramite: t, categoria: c }
  }
  return {}
}

/** Texto que viene del contenido oficial y puede traer <b> o enlaces */
const Html = ({ children, className = '' }) => (
  <span className={`texto-datos ${className}`} dangerouslySetInnerHTML={{ __html: children }} />
)

export default function TramiteDetalle() {
  const { id } = useParams()
  const { tramite: t, categoria: c } = buscar(id)

  const leido = useStore((s) => !!s.leidos[id])
  const marcar = useStore((s) => s.marcarLeido)
  const abrirAviso = useStore((s) => s.abrirAviso)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!t) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-[15px] text-gris">No encontramos ese trámite.</p>
        <Link to="/tramites" className="mt-4 inline-block font-semibold text-rojo hover:underline">
          Ver todos los trámites
        </Link>
      </main>
    )
  }

  // Orden de preferencia: plataforma externa → correo → enlace propio del
  // trámite → enlace de su categoría en el sistema de citas.
  const destino = t.citaExterna
    ? { texto: 'Ir a la plataforma en línea', href: t.citaExterna }
    : t.citaEmail
    ? { texto: 'Solicitar cita por correo',
        href: `mailto:${t.citaEmail}?subject=${encodeURIComponent('Solicitud de cita - ' + t.nombre)}` }
    : { texto: 'Haz tu cita', href: t.citaUrl || c.citaUrl }

  return (
    <main className="mx-auto max-w-3xl px-5 pt-6 pb-4">
      <nav className="text-[12.5px] text-gris-medio">
        <Link to="/tramites" className="font-semibold hover:text-rojo">Trámites consulares</Link>
        <span className="mx-1.5">/</span>
        <span>{c.nombre}</span>
      </nav>

      <header className="mt-4 flex items-start gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rojo text-white">
          <Icono nombre={t.icono} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[21px] font-bold leading-tight text-tinta">{t.nombre}</h1>
          {t.costo && (
            <p className="mt-1.5 inline-block rounded-md bg-verde-suave px-2 py-1 text-[12.5px] font-bold text-verde">
              {t.costo}
            </p>
          )}
        </div>
      </header>

      {t.intro && (
        <p className="texto-datos mt-5 text-[14px] leading-relaxed text-gris"
           dangerouslySetInnerHTML={{ __html: t.intro }} />
      )}

      {t.requisitos.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[15px] font-bold text-tinta">Requisitos</h2>
          <ul className="mt-3 space-y-2.5">
            {t.requisitos.map((r, k) => (
              <li key={k} className="flex gap-3">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-rojo" />
                <Html className="text-[13.5px] leading-relaxed text-gris">{r}</Html>
              </li>
            ))}
          </ul>
        </section>
      )}

      {t.pasos.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[15px] font-bold text-tinta">
            Hazlo en {t.pasos.length} pasos
          </h2>
          <ol className="mt-3 space-y-4">
            {t.pasos.map((p, k) => (
              <li key={k} className="flex gap-3.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rojo text-[12px] font-bold text-white">
                  {k + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[14px] font-semibold text-tinta">{p.titulo}</p>
                  <Html className="mt-0.5 block text-[13.5px] leading-relaxed text-gris">{p.detalle}</Html>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {t.alerta && (
        <aside className="mt-7 rounded-xl border border-rojo/20 bg-rojo-suave p-4">
          <p className="text-[13px] font-bold text-rojo">Importante</p>
          <Html className="mt-1.5 block text-[13px] leading-relaxed text-gris">{t.alerta}</Html>
        </aside>
      )}

      {/* ── Confirmación de lectura y acceso a la cita ── */}
      <section className="mt-8 rounded-[var(--radius-card)] border border-linea bg-white p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={leido}
                 onChange={(e) => marcar(id, e.target.checked)}
                 className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-rojo)]" />
          <span className="text-[14px] font-semibold leading-snug text-tinta">
            Leí todos los requisitos
          </span>
        </label>

        <motion.button
          type="button"
          disabled={!leido}
          onClick={() => abrirAviso({ ...t, destino })}
          animate={leido ? { scale: [1, 1.015, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={`mt-4 w-full rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors
            ${leido
              ? 'bg-rojo text-white shadow-[0_3px_14px_rgba(210,35,42,.3)] hover:bg-rojo-osc cursor-pointer'
              : 'bg-papel text-gris-medio cursor-not-allowed'}`}>
          {destino.texto}
        </motion.button>

        {!leido && (
          <p className="mt-2.5 text-center text-[12.5px] text-gris-medio">
            Marca la casilla para continuar
          </p>
        )}
      </section>

      <a href={t.url} target="_blank" rel="noopener noreferrer"
         className="mt-4 block text-center text-[13px] font-semibold text-gris-medio hover:text-rojo">
        Ver este trámite en gob.pe
      </a>
    </main>
  )
}
