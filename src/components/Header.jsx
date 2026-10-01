import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const enInicio = pathname === '/'

  return (
    <header className="bg-white border-b-4 border-rojo shadow-[0_2px_8px_rgba(0,0,0,.06)]">
      <div className="mx-auto max-w-3xl px-5 py-4 flex flex-col items-center gap-2.5">
        <Link to="/" aria-label="Ir al inicio">
          <img src="./assets/logo.png" alt="Consulado General del Perú en Miami"
               className="h-14 sm:h-16 w-auto" />
        </Link>
        <p className="text-center text-[13px] leading-relaxed text-gris">
          Si tiene alguna consulta comuníquese con{' '}
          <a href="mailto:informacion@consulado-peru.com"
             className="text-rojo font-semibold hover:underline">
            informacion@consulado-peru.com
          </a>
          <span className="mx-1.5 text-linea">|</span>
          <a href="tel:+17867132401" className="text-rojo font-semibold hover:underline">
            (786) 713-2401
          </a>
        </p>
      </div>

      {!enInicio && (
        <div className="border-t border-linea bg-papel">
          <div className="mx-auto max-w-3xl px-5 py-2.5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gris hover:text-rojo transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
