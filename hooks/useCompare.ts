'use client'

import { create } from 'zustand'

type CompareState = {
  ids: string[]
  max: number
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareState>((set, get) => ({
  ids: [],
  max: 4,
  toggle: (id) => {
    const { ids, max } = get()
    if (ids.includes(id)) {
      set({ ids: ids.filter((x) => x !== id) })
      return
    }
    if (ids.length >= max) return
    set({ ids: [...ids, id] })
  },
  remove: (id) => {
    set({ ids: get().ids.filter((x) => x !== id) })
  },
  clear: () => set({ ids: [] }),
}))

