import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const acciones = [
  {
    to: '/tramites',
    titulo: 'Haz tu cita',
    pie: 'Revisa los requisitos y reserva',
    tono: 'bg-rojo text-white shadow-[0_3px_14px_rgba(210,35,42,.3)]',
    icono: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  },
  {
    to: '/estado',
    titulo: 'Estado de mi trámite',
    pie: 'Consulta con tu número de DNI',
    tono: 'bg-gris text-white shadow-[0_3px_14px_rgba(88,89,91,.26)]',
    icono: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></>,
  },
]

export default function BotonesPrincipales() {
  return (
    <nav className="grid gap-3 sm:grid-cols-2" aria-label="Accesos principales">
      {acciones.map((a, i) => (
        <motion.div key={a.to}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}>
          <Link to={a.to}
            className={`${a.tono} group flex items-center gap-3.5 rounded-[var(--radius-card)] px-5 py-5 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                {a.icono}
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[17px] font-bold leading-tight">{a.titulo}</span>
              <span className="block text-[12.5px] text-white/75 mt-0.5">{a.pie}</span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-150 group-hover:translate-x-0.5"
                 aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </motion.div>
      ))}
    </nav>
  )
}
