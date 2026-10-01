import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DB from '../data/estado.json'

const TONOS = {
  ok:     'bg-verde-suave text-verde',
  alerta: 'bg-[#FDECD9] text-[#9C4D00]',
  info:   'bg-[#E3EEFB] text-[#1D5A96]',
}

function tono(estado) {
  const t = estado.toLowerCase()
  if (t.includes('listo')) return 'ok'
  if (t.includes('observado')) return 'alerta'
  return 'info'
}

/** Convierte el correo que viene dentro del estado en un enlace */
function conEnlace(estado) {
  const m = estado.match(/([\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,})/)
  if (!m) return estado
  const texto = estado.replace(m[0], '').replace(/,\s*$/, '').trim()
  return `${texto} <a href="mailto:${m[0]}" class="underline font-bold">${m[0]}</a>`
}

export default function Estado() {
  const [tipo, setTipo] = useState('dni')
  const [valor, setValor] = useState('')
  const [res, setRes] = useState(null)

  const cambiarTipo = (t) => { setTipo(t); setValor(''); setRes(null) }

  const buscar = (e) => {
    e.preventDefault()
    const v = valor.trim()
    if (!v) return
    const encontrado = (DB[tipo] || []).find((r) => r.doc === v)
    setRes(encontrado ? { ok: true, ...encontrado } : { ok: false, valor: v })
  }

  const etiqueta = tipo === 'dni' ? 'DNI' : 'Pasaporte'

  return (
    <main className="mx-auto max-w-2xl px-5 pt-7">
      <h1 className="text-center text-[22px] font-bold leading-tight text-tinta">
        Estado de mi trámite
      </h1>
      <p className="mt-1.5 text-center text-[14px] text-gris">
        Consulta con tu número de DNI
      </p>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-linea bg-white">
        <div role="tablist" aria-label="Tipo de documento" className="grid grid-cols-2">
          {[['dni', 'DNI'], ['pasaporte', 'Pasaporte']].map(([k, nombre]) => (
            <button key={k} role="tab" aria-selected={tipo === k}
              onClick={() => cambiarTipo(k)}
              className={`relative px-4 py-4 text-[15px] font-bold transition-colors
                ${tipo === k ? 'bg-white text-rojo' : 'bg-papel text-gris hover:text-tinta'}`}>
              {nombre}
              {tipo === k && (
                <motion.span layoutId="pestana" className="absolute inset-x-0 bottom-0 h-[3px] bg-rojo" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={buscar} className="border-t border-linea p-6">
          <label htmlFor="doc" className="block text-[13px] font-semibold text-gris">
            Número de DNI
          </label>
          <p className="mt-1 text-[12.5px] text-gris-medio">
            El pasaporte también se consulta con el número de DNI.
          </p>

          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
            <input id="doc" type="text" inputMode="numeric" autoComplete="off"
              value={valor} onChange={(e) => setValor(e.target.value)}
              placeholder="Ej: 47101040"
              className="flex-1 rounded-xl border-[1.5px] border-linea bg-papel px-4 py-3.5 text-[16px]
                         text-tinta outline-none transition-colors placeholder:text-gris-medio/60
                         focus:border-rojo focus:bg-white" />
            <button type="submit"
              className="rounded-xl bg-rojo px-7 py-3.5 text-[15px] font-bold text-white
                         transition-colors hover:bg-rojo-osc">
              Buscar
            </button>
          </div>

          <AnimatePresence mode="wait">
            {res && (
              <motion.div key={res.ok ? res.doc + tipo : 'vacio'}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
                className="mt-6">
                {res.ok ? (
                  <div className="space-y-2.5">
                    {[['Documento', `${etiqueta} ${res.doc}`],
                      ['Nombre completo', `${res.nombre} ${res.apellidos}`]].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-papel px-4 py-3">
                        <p className="text-[12px] font-semibold text-gris-medio">{l}</p>
                        <p className="mt-0.5 text-[15px] font-semibold text-tinta">{v}</p>
                      </div>
                    ))}
                    <div className="rounded-xl bg-papel px-4 py-3">
                      <p className="text-[12px] font-semibold text-gris-medio">Estado del trámite</p>
                      <p className={`mt-1.5 rounded-lg px-4 py-2.5 text-[14px] font-bold leading-relaxed ${TONOS[tono(res.estado)]}`}
                         dangerouslySetInnerHTML={{ __html: conEnlace(res.estado) }} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rojo/25 border-l-4 border-l-rojo bg-rojo-suave px-4 py-3.5">
                    <p className="text-[14px] leading-relaxed text-tinta">
                      No hay ningún trámite registrado con el número{' '}
                      <strong className="text-rojo">{res.valor}</strong>. Revise el número o
                      escríbanos a{' '}
                      <a href="mailto:informacion@consulado-peru.com"
                         className="font-semibold text-rojo underline">
                        informacion@consulado-peru.com
                      </a>.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </main>
  )
}
