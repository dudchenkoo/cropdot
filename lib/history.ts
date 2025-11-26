export interface HistoryState<T> {
  past: T[]
  present: T | null
  future: T[]
  limit: number
}

export function createHistory<T>(initialState: T | null, limit = 50): HistoryState<T> {
  return {
    past: [],
    present: initialState,
    future: [],
    limit,
  }
}

export function pushState<T>(history: HistoryState<T>, state: T): HistoryState<T> {
  if (history.present === null) {
    return { ...history, present: state, future: [] }
  }

  const past = [...history.past, history.present]
  const trimmedPast = past.length > history.limit ? past.slice(past.length - history.limit) : past

  return {
    past: trimmedPast,
    present: state,
    future: [],
    limit: history.limit,
  }
}

export function undo<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.past.length === 0) return history

  const previous = history.past[history.past.length - 1]
  const newPast = history.past.slice(0, -1)
  const future = history.present !== null ? [history.present, ...history.future] : history.future

  return {
    past: newPast,
    present: previous,
    future,
    limit: history.limit,
  }
}

export function redo<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.future.length === 0) return history

  const next = history.future[0]
  const newFuture = history.future.slice(1)
  const past = history.present !== null ? [...history.past, history.present] : history.past
  const trimmedPast = past.length > history.limit ? past.slice(past.length - history.limit) : past

  return {
    past: trimmedPast,
    present: next,
    future: newFuture,
    limit: history.limit,
  }
}

export function canUndo<T>(history: HistoryState<T>): boolean {
  return history.past.length > 0
}

export function canRedo<T>(history: HistoryState<T>): boolean {
  return history.future.length > 0
}
