const SAVE_KEY = 'web-balatro-save'

export interface SaveData {
  version: 1 | 2
  state: Record<string, unknown>
}

export function saveGame(state: Record<string, unknown>): void {
  try {
    const data: SaveData = { version: 2, state }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function loadGame(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as SaveData
    if ((data.version !== 1 && data.version !== 2) || !data.state) return null
    return data.state
  } catch {
    // corrupted data
    clearSave()
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // unavailable
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null
  } catch {
    return false
  }
}
