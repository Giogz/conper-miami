import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  const navigate = useNavigate()
  const { tramite: t, categoria: c } = buscar(id)
  const abrirAviso = useStore((s) => s.abrirAviso)

  // Estado local: al recargar o al cambiar de trámite las marcas se pierden.
  // No se guarda nada en el navegador.
  const [marcados, setMarcados] = useState({})
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    setMarcados({})
    setConfirmado(false)
    window.scrollTo(0, 0)
  }, [id])

  const total = t?.requisitos.length ?? 0
  const listos = useMemo(() => Object.values(marcados).filter(Boolean).length, [marcados])
  const todos = total > 0 && listos === total
  const habilitado = total === 0 ? confirmado : todos && confirmado

  // Si se desmarca un requisito, la confirmación final deja de ser válida
  const alternar = (k) => {
    setMarcados((m) => {
      const n = { ...m, [k]: !m[k] }
      if (Object.values(n).filter(Boolean).length < total) setConfirmado(false)
      return n
    })
  }

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

  const destino = t.citaExterna
    ? { texto: t.citaTexto || 'Ir a la plataforma en línea', href: t.citaExterna }
    : t.citaEmail
    ? { texto: 'Solicitar cita por correo',
        href: `mailto:${t.citaEmail}?subject=${encodeURIComponent('Solicitud de cita - ' + t.nombre)}` }
    : { texto: 'Haz tu cita', href: t.citaUrl || c.citaUrl }

  const faltan = total - listos

  return (
    <main className="mx-auto max-w-3xl px-4 pb-6 sm:px-5">
      {/* Volver, siempre visible al desplazarse */}
      <div className="sticky top-0 z-30 -mx-4 bg-papel/92 px-4 py-2.5 backdrop-blur sm:-mx-5 sm:px-5">
        <button onClick={() => navigate('/tramites')}
          className="inline-flex items-center gap-2 rounded-full border border-linea bg-white
                     px-4 py-2 text-[13.5px] font-semibold text-tinta shadow-sm
                     transition-colors hover:border-rojo hover:text-rojo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver a los trámites
        </button>
      </div>

      <p className="mt-2 text-[12.5px] text-gris-medio">{c.nombre}</p>

      <header className="mt-2.5 flex items-start gap-3 sm:gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rojo text-white sm:h-12 sm:w-12">
          <Icono nombre={t.icono} className="h-[22px] w-[22px] sm:h-6 sm:w-6" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[19px] font-bold leading-tight text-tinta sm:text-[22px]">{t.nombre}</h1>
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

      {/* ── Requisitos, uno por uno ── */}
      {total > 0 && (
        <section className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[15px] font-bold text-tinta">Requisitos</h2>
            <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold transition-colors
                              ${todos ? 'bg-verde-suave text-verde' : 'border border-linea bg-white text-gris-medio'}`}>
              {listos} de {total}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-gris-medio">
            Marca cada requisito a medida que lo revisas.
          </p>

          <ul className="mt-3 space-y-2">
            {t.requisitos.map((r, k) => {
              const on = !!marcados[k]
              return (
                <li key={k}>
                  <label className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors
                                     ${on ? 'border-verde/35 bg-verde-suave/45' : 'border-linea bg-white'}`}>
                    <input type="checkbox" checked={on} onChange={() => alternar(k)}
                      aria-label={'Requisito ' + (k + 1) + ' de ' + total}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--color-verde)]" />
                    <Html className={`text-[13.5px] leading-relaxed ${on ? 'text-gris/80' : 'text-gris'}`}>{r}</Html>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {t.pasos.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[15px] font-bold text-tinta">Hazlo en {t.pasos.length} pasos</h2>
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

      {/* ── Confirmación y acceso a la cita ── */}
      <section className="mt-8 rounded-[var(--radius-card)] border border-linea bg-white p-5">
        <label className={`flex items-start gap-3 ${todos || total === 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`}>
          <input type="checkbox" checked={confirmado}
                 disabled={total > 0 && !todos}
                 onChange={(e) => setConfirmado(e.target.checked)}
                 className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-rojo)]
                            enabled:cursor-pointer disabled:cursor-not-allowed" />
          <span className="text-[14px] font-semibold leading-snug text-tinta">
            Leí todos los requisitos
          </span>
        </label>

        <button type="button" disabled={!habilitado}
          onClick={() => abrirAviso({ ...t, destino })}
          className={`mt-4 w-full rounded-xl px-5 py-3.5 text-[15px] font-bold transition-colors
            ${habilitado
              ? 'cursor-pointer bg-rojo text-white shadow-[0_3px_14px_rgba(210,35,42,.3)] hover:bg-rojo-osc'
              : 'cursor-not-allowed bg-papel text-gris-medio'}`}>
          {destino.texto}
        </button>

        <AnimatePresence mode="wait">
          {!habilitado && (
            <motion.p key={todos ? 'falta-check' : 'faltan-req'}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-2.5 text-center text-[12.5px] text-gris-medio">
              {total > 0 && !todos
                ? (faltan === 1 ? 'Te falta 1 requisito por marcar' : `Te faltan ${faltan} requisitos por marcar`)
                : 'Marca la casilla para continuar'}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <a href={t.url} target="_blank" rel="noopener noreferrer"
         className="mt-4 block text-center text-[13px] font-semibold text-gris-medio hover:text-rojo">
        Ver este trámite en gob.pe
      </a>
    </main>
  )
}
