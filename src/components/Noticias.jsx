import { useEffect, useRef, useState, useCallback } from 'react'
import noticias from '../data/noticias.json'

export default function Noticias() {
  const [i, setI] = useState(0)
  const [porVista, setPorVista] = useState(2)
  const pista = useRef(null)
  const tocado = useRef(null)

  useEffect(() => {
    const medir = () => setPorVista(window.innerWidth <= 640 ? 1 : 2)
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  const max = Math.max(0, noticias.length - porVista)
  const ir = useCallback((n) => setI(Math.max(0, Math.min(n, max))), [max])

  useEffect(() => { if (i > max) setI(max) }, [max, i])

  // Avance automático, en pausa si el usuario prefiere menos movimiento
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((p) => (p >= max ? 0 : p + 1)), 6000)
    return () => clearInterval(t)
  }, [max])

  const inicioTacto = (e) => { tocado.current = e.touches[0].clientX }
  const finTacto = (e) => {
    if (tocado.current == null) return
    const d = tocado.current - e.changedTouches[0].clientX
    if (Math.abs(d) > 45) ir(d > 0 ? i + 1 : i - 1)
    tocado.current = null
  }

  return (
    <section aria-label="Noticias y comunicados">
      <h2 className="mb-3 text-[15px] font-bold text-tinta">Noticias y comunicados</h2>

      <div className="relative overflow-hidden">
        <div ref={pista}
             className="flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(calc(-${i} * (100% / ${porVista})))` }}
             onTouchStart={inicioTacto} onTouchEnd={finTacto}>
          {noticias.map((n, k) => {
            const Envoltura = n.url ? 'a' : 'div'
            return (
              <div key={k} className="shrink-0 pr-3"
                   style={{ width: `calc(100% / ${porVista})` }}>
                <Envoltura
                  {...(n.url ? { href: n.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`block h-full overflow-hidden rounded-[var(--radius-card)] border border-linea bg-white
                              ${n.url ? 'group cursor-pointer hover:border-gris-medio/40' : ''} transition-colors`}>
                  <div className="aspect-square overflow-hidden bg-linea">
                    <img src={`./assets/noticias/${n.img}`} alt={n.alt} loading="lazy"
                         className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <p className="texto-datos p-3.5 text-[13px] leading-relaxed text-gris">{n.texto}</p>
                </Envoltura>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {Array.from({ length: max + 1 }).map((_, k) => (
          <button key={k} onClick={() => ir(k)}
                  aria-label={`Ver noticia ${k + 1}`}
                  aria-current={k === i}
                  className={`h-1.5 rounded-full transition-all duration-300
                              ${k === i ? 'w-5 bg-rojo' : 'w-1.5 bg-linea hover:bg-gris-medio/50'}`} />
        ))}
      </div>
    </section>
  )
}
