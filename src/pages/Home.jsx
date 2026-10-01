import BotonesPrincipales from '../components/BotonesPrincipales'
import Noticias from '../components/Noticias'

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-7">
      <BotonesPrincipales />
      <div className="mt-9">
        <Noticias />
      </div>
    </main>
  )
}
