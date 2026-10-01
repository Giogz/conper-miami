import iconos from '../data/iconos.json'

export default function Icono({ nombre, className = 'w-5 h-5' }) {
  const d = iconos[nombre]
  if (!d) return null
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
         className={className} dangerouslySetInnerHTML={{ __html: d }} />
  )
}
