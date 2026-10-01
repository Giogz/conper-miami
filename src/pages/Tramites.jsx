import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import categorias from '../data/tramites.json'
import { useStore } from '../store'
import Icono from '../components/Icono'

function Precio({ costo }) {
  if (!costo) return null
  const m = costo.match(/US\$ [\d,]+\.\d{2}/)
  const texto = m ? m[0] : costo === 'Gratuito' ? 'Gratuito' : 'Ver costo'
  return (
    <span className="rounded-md bg-verde-suave px-1.5 py-0.5 text-[11px] font-bold text-verde">
      {texto}
    </span>
  )
}

export default function Tramites() {
  const abierta = useStore((s) => s.categoriaAbierta)
  const abrir = useStore((s) => s.abrirCategoria)

  return (
    <main className="mx-auto max-w-3xl px-5 pt-7">
      <h1 className="text-[22px] font-bold leading-tight text-tinta">Trámites consulares</h1>
      <p className="mt-1.5 max-w-prose text-[14px] leading-relaxed text-gris">
        Elige tu trámite para ver los requisitos, los pasos y el costo. Al final de cada uno
        podrás reservar tu cita.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {categorias.map((c) => {
          const activa = abierta === c.slug
          return (
            <section key={c.slug}
              className={`overflow-hidden rounded-[var(--radius-card)] border bg-white transition-colors
                          ${activa ? 'border-rojo sm:col-span-2' : 'border-linea'}`}>
              <h2>
                <button onClick={() => abrir(c.slug)}
                        aria-expanded={activa}
                        className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-papel/60 transition-colors">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors
                                    ${activa ? 'bg-rojo text-white' : 'bg-rojo-suave text-rojo'}`}>
                    <Icono nombre={c.icono} className="h-[21px] w-[21px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[15px] font-bold leading-tight ${activa ? 'text-rojo' : 'text-tinta'}`}>
                      {c.nombre}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-gris-medio">
                      {c.tramites.length} {c.tramites.length === 1 ? 'trámite' : 'trámites'}
                    </span>
                  </span>
                  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                       animate={{ rotate: activa ? 180 : 0 }} transition={{ duration: 0.2 }}
                       className="h-4 w-4 shrink-0 text-gris-medio">
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>
              </h2>

              <AnimatePresence initial={false}>
                {activa && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden border-t border-linea bg-papel">
                    <ul className="grid gap-2.5 p-3.5 sm:grid-cols-2">
                      {c.tramites.map((t) => (
                        <li key={t.id}>
                          <Link to={`/tramite/${t.id}`}
                            className="group flex h-full items-center gap-3 rounded-xl border border-linea bg-white p-3.5
                                       transition-all hover:border-rojo/40 hover:shadow-[0_4px_14px_rgba(0,0,0,.07)]">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-papel text-gris
                                             transition-colors group-hover:bg-rojo group-hover:text-white">
                              <Icono nombre={t.icono} className="h-[18px] w-[18px]" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[13.5px] font-semibold leading-snug text-tinta">
                                {t.nombre}
                              </span>
                              <span className="mt-1 block"><Precio costo={t.costo} /></span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )
        })}
      </div>
    </main>
  )
}
