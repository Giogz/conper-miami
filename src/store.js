import { create } from 'zustand'

/**
 * Estado global de la app.
 * - categoriaAbierta: slug de la categoría desplegada en /tramites
 * - leidos: ids de trámites cuyos requisitos el usuario marcó como leídos
 * - aviso: trámite cuyo modal de advertencia está abierto (null = cerrado)
 */
export const useStore = create((set) => ({
  categoriaAbierta: null,
  abrirCategoria: (slug) =>
    set((s) => ({ categoriaAbierta: s.categoriaAbierta === slug ? null : slug })),

  leidos: {},
  marcarLeido: (id, valor) =>
    set((s) => ({ leidos: { ...s.leidos, [id]: valor } })),

  aviso: null,
  abrirAviso: (tramite) => set({ aviso: tramite }),
  cerrarAviso: () => set({ aviso: null }),
}))
