import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store'

export default function ModalAviso() {
  const aviso = useStore((s) => s.aviso)
  const cerrar = useStore((s) => s.cerrarAviso)
  const { pathname } = useLocation()

  // Si el usuario navega a otra pantalla, el aviso no debe quedarse abierto
  useEffect(() => { cerrar() }, [pathname, cerrar])

  // Texto por defecto: trámites que sí requieren cita presencial
  const POR_DEFECTO = {
    titulo: 'Antes de reservar su cita',
    parrafos: [
      'El día de su cita debe presentar todos los documentos de la lista de requisitos. Si falta alguno, no podremos realizar el trámite y tendrá que reservar una cita nueva.',
      'Revise la lista con calma antes de continuar.',
    ],
    confirmar: 'Tengo todo, continuar',
  }
  const texto = aviso?.aviso || POR_DEFECTO
  const confirmar = useRef(null)

  useEffect(() => {
    if (!aviso) return
    const esc = (e) => e.key === 'Escape' && cerrar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    confirmar.current?.focus()
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aviso, cerrar])

  return (
    <AnimatePresence>
      {aviso && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/55 p-0 sm:items-center sm:p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={cerrar}>
          <motion.div
            role="alertdialog" aria-modal="true" aria-labelledby="aviso-titulo"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">

            <span className="grid h-11 w-11 place-items-center rounded-xl bg-rojo-suave text-rojo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              </svg>
            </span>

            <h2 id="aviso-titulo" className="mt-3.5 text-[18px] font-bold leading-tight text-tinta">
              {texto.titulo}
            </h2>

            {texto.parrafos.map((p, k) => (
              <p key={k} className="mt-2.5 text-[14px] leading-relaxed text-gris"
                 dangerouslySetInnerHTML={{ __html: p }} />
            ))}

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
              <button onClick={cerrar}
                className="flex-1 rounded-xl border border-linea bg-white px-4 py-3 text-[14px] font-semibold text-gris hover:bg-papel transition-colors">
                Volver a los requisitos
              </button>
              <a ref={confirmar}
                 href={aviso.destino.href}
                 target={aviso.destino.href.startsWith('mailto:') ? undefined : '_blank'}
                 rel="noopener noreferrer"
                 onClick={cerrar}
                 className="flex-1 rounded-xl bg-rojo px-4 py-3 text-center text-[14px] font-bold text-white hover:bg-rojo-osc transition-colors">
                {texto.confirmar}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
