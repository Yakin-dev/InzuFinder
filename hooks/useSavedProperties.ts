'use client'

import { create } from 'zustand'
import toast from 'react-hot-toast'

type SavedState = {
  loaded: boolean
  canUseDb: boolean
  savedIds: string[]
  loading: boolean
  load: () => Promise<void>
  toggle: (houseId: string) => Promise<void>
  isSaved: (houseId: string) => boolean
}

const MAX_LOCAL = 5

export const useSavedPropertiesStore = create<SavedState>((set, get) => ({
  loaded: false,
  canUseDb: false,
  savedIds: [],
  loading: false,

  isSaved: (houseId) => {
    const { savedIds } = get()
    return savedIds.includes(houseId)
  },

  load: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true })
    try {
      const me = await fetch('/api/auth/me')
      if (!me.ok) {
        const local = localStorage.getItem('inzu_favorites')
        let ids: string[] = []
        if (local) {
          try {
            const parsed = JSON.parse(local)
            if (Array.isArray(parsed)) ids = parsed as string[]
          } catch {
            ids = []
          }
        }
        set({ canUseDb: false, loaded: true, savedIds: ids.slice(0, MAX_LOCAL) })
        return
      }
      const data = await me.json()
      const user = data?.user
      if (!user || user.role !== 'TENANT') {
        const local = localStorage.getItem('inzu_favorites')
        let ids: string[] = []
        if (local) {
          try {
            const parsed = JSON.parse(local)
            if (Array.isArray(parsed)) ids = parsed as string[]
          } catch {
            ids = []
          }
        }
        set({ canUseDb: false, loaded: true, savedIds: ids.slice(0, MAX_LOCAL) })
        return
      }

      const savedRes = await fetch('/api/saved')
      if (!savedRes.ok) {
        set({ canUseDb: true, loaded: true, savedIds: [] })
        return
      }
      const saved = await savedRes.json()
      const ids = Array.isArray(saved?.saved) ? saved.saved.map((h: any) => h.id) : []
      set({ canUseDb: true, loaded: true, savedIds: ids })
    } catch {
      const local = localStorage.getItem('inzu_favorites')
      let ids: string[] = []
      if (local) {
        try {
          const parsed = JSON.parse(local)
          if (Array.isArray(parsed)) ids = parsed as string[]
        } catch {
          ids = []
        }
      }
      set({ canUseDb: false, loaded: true, savedIds: ids.slice(0, MAX_LOCAL) })
    } finally {
      set({ loading: false })
    }
  },

  toggle: async (houseId) => {
    const { canUseDb, savedIds } = get()
    const currentlySaved = savedIds.includes(houseId)

    // DB mode for tenants
    if (canUseDb) {
      // best-effort: if user toggles before loaded, load now
      if (!get().loaded) await get().load()
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ houseId }),
      }).catch(() => null)

      // If already saved, calling POST is idempotent. For unsave, do DELETE.
      if (currentlySaved) {
        await fetch('/api/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ houseId }),
        }).catch(() => null)
        set({ savedIds: savedIds.filter((x) => x !== houseId) })
      } else {
        set({ savedIds: [...savedIds, houseId] })
      }

      return
    }

    // Local mode (unauthenticated): keep a small capped list
    const saved = localStorage.getItem('inzu_favorites')
    let arr: string[] = []
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) arr = parsed as string[]
      } catch {
        arr = []
      }
    }

    if (currentlySaved) {
      arr = arr.filter((x) => x !== houseId)
      set({ savedIds: arr })
      localStorage.setItem('inzu_favorites', JSON.stringify(arr))
      return
    }

    if (arr.length >= MAX_LOCAL) {
      toast.error('Login to save more properties.')
      return
    }

    arr = [...arr, houseId]
    localStorage.setItem('inzu_favorites', JSON.stringify(arr))
    set({ savedIds: arr })
  },
}))

