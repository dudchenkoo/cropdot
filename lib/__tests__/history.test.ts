import { canRedo, canUndo, createHistory, pushState, redo, undo } from "@/lib/history"

describe("history utilities", () => {
  it("initializes with present state and limit", () => {
    const history = createHistory("start", 10)

    expect(history.present).toBe("start")
    expect(history.limit).toBe(10)
    expect(history.past).toEqual([])
    expect(history.future).toEqual([])
  })

  it("pushes new states and trims past beyond limit", () => {
    let history = createHistory<number>(0, 2)
    history = pushState(history, 1)
    history = pushState(history, 2)
    history = pushState(history, 3)

    expect(history.present).toBe(3)
    expect(history.past).toEqual([1, 2])
    expect(history.future).toEqual([])
  })

  it("supports undo and redo flows", () => {
    let history = createHistory<number>(1)
    history = pushState(history, 2)
    history = pushState(history, 3)

    const undone = undo(history)
    expect(undone.present).toBe(2)
    expect(undone.future).toEqual([3])

    const redone = redo(undone)
    expect(redone.present).toBe(3)
    expect(redone.past).toEqual([1, 2])
  })

  it("prevents undo and redo when no history exists", () => {
    const history = createHistory<string>(null)

    expect(undo(history)).toEqual(history)
    expect(redo(history)).toEqual(history)
    expect(canUndo(history)).toBe(false)
    expect(canRedo(history)).toBe(false)
  })
})
