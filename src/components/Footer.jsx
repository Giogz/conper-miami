export default function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-5 pt-8 pb-10 text-center">
      <p className="text-[13px] text-gris-medio leading-relaxed">
        Consulado General del Perú en Miami<br />
        1401 Ponce de Leon Blvd, Coral Gables, FL 33134
      </p>
      <p className="mt-2 text-[11px] italic text-linea-oscura text-gris-medio/70">
        Developed with <span className="text-rojo not-italic animate-[latido_1.2s_ease-in-out_infinite] inline-block">♥</span> by Gio
      </p>
      <style>{`@keyframes latido{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}`}</style>
    </footer>
  )
}
