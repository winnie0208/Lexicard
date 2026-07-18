import { useEffect, type DependencyList, type RefObject } from 'react'

// Lets desktop users grab-and-drag a horizontal-only carousel with the mouse
// (no trackpad or horizontal wheel needed). Tracks whether a real drag
// happened so a plain click (e.g. opening a card) still passes through
// untouched — only drags past a small threshold are treated as scrolling.
//
// Release behaviour is direction-aware: a deliberate drag (beyond the
// threshold) always settles at least one card boundary in the drag
// direction instead of bouncing back to the nearest snap point; CSS snapping
// is re-enabled only after the smooth scroll has settled.
//
// Extra affordances (使用者回饋，LOG-20260718-02／03／04)：
// - 拖曳超過列表頭尾時以阻尼位移呈現 rubber-band 效果，放開後動畫彈回，
//   取代硬停＋瞬間校準。
// - 列表末端為「自由區」——最後幾張卡的起點貼齊位置超出可捲動範圍時，
//   不再強制捲到最右（自動靠右），放開時停在原地。
// - 快甩（fling）帶慣性：依放開瞬間速度投影滑行距離（可跨多張卡），以
//   ease-out 減速停在卡片邊界；滑行中再按住可即時抓停，比照觸控手感。
//
// `deps` should include whatever makes the container go from unmounted to
// mounted (e.g. the list's length) — see useSnapAlign for why.

// 拖曳超過此距離即視為「有方向意圖」，放開時至少前進／後退一張卡。
const DIRECTION_INTENT_THRESHOLD_PX = 40
// 平滑捲動停止後多久視為停穩（與 useSnapAlign 的 debounce 同量級）。
const SETTLE_DEBOUNCE_MS = 150
// 邊界外拖曳的阻尼與最大位移（rubber-band）。
const OVERSCROLL_RESISTANCE = 0.35
const OVERSCROLL_MAX_PX = 64
const OVERSCROLL_RETURN_MS = 250
// 放開位置距任何卡片邊界皆超過此距離時視為自由區（實務上只會發生在列表
// 末端），不做對齊校正。中段相鄰邊界間距約為卡寬＋間距（~300px），一半
// 以內必有邊界，不會誤判。
const FREE_ZONE_DISTANCE_PX = 160
// 慣性甩動：速度取樣視窗、視為 fling 的最低速度、滑行距離投影係數與
// 減速動畫時長範圍。
const VELOCITY_SAMPLE_WINDOW_MS = 100
const FLING_VELOCITY_PX_PER_MS = 0.5
const MOMENTUM_PROJECTION_MS = 300
const MOMENTUM_MIN_DURATION_MS = 250
const MOMENTUM_MAX_DURATION_MS = 650

export function useDragToScroll(
  containerRef: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
  snapPaddingPx = 20,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isDragging = false
    let didDrag = false
    let startX = 0
    let startScrollLeft = 0
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let settleListener: (() => void) | undefined
    let overscrollResetTimer: ReturnType<typeof setTimeout> | undefined
    let momentumFrame: number | undefined
    // 近期滑鼠位置取樣，供放開時計算甩動速度。
    let moveSamples: { x: number; t: number }[] = []

    function cancelMomentum() {
      if (momentumFrame !== undefined) {
        cancelAnimationFrame(momentumFrame)
        momentumFrame = undefined
      }
    }

    // 以 ease-out（cubic）動畫捲動至目標，模擬慣性減速。
    function animateScrollTo(el: HTMLElement, to: number, duration: number) {
      cancelMomentum()
      const from = el.scrollLeft
      const startTime = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.scrollLeft = from + (to - from) * eased
        momentumFrame = progress < 1 ? requestAnimationFrame(step) : undefined
      }
      momentumFrame = requestAnimationFrame(step)
    }

    // 放開瞬間的捲動速度（px/ms，正值＝往列表後方）——取樣視窗內最舊與
    // 最新兩點的位移平均。
    function releaseVelocity(): number {
      if (moveSamples.length < 2) return 0
      const newest = moveSamples[moveSamples.length - 1]
      const oldest = moveSamples[0]
      const elapsed = newest.t - oldest.t
      if (elapsed <= 0) return 0
      return -(newest.x - oldest.x) / elapsed
    }

    function cancelPendingSnapRestore(el: HTMLElement) {
      clearTimeout(settleTimer)
      if (settleListener) {
        el.removeEventListener('scroll', settleListener)
        settleListener = undefined
      }
    }

    // 平滑捲動抵達目標並停穩後才恢復 CSS 貼齊——立刻恢復會讓貼齊中途搶走
    // 捲動位置。
    function restoreSnapAfterSettle(el: HTMLElement) {
      cancelPendingSnapRestore(el)
      const restore = () => {
        cancelPendingSnapRestore(el)
        el.style.scrollSnapType = ''
      }
      settleListener = () => {
        clearTimeout(settleTimer)
        settleTimer = setTimeout(restore, SETTLE_DEBOUNCE_MS)
      }
      el.addEventListener('scroll', settleListener, { passive: true })
      // 目標位置與當前相同時不會有 scroll 事件，需保底恢復。
      settleTimer = setTimeout(restore, SETTLE_DEBOUNCE_MS)
    }

    // 各卡片「起點貼齊」的理想捲動位置；超出可捲動範圍的（列表末端最後
    // 幾張）不列入——那一段是自由區，不做對齊。
    function cardTargets(el: HTMLElement): number[] {
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      return (Array.from(el.children) as HTMLElement[])
        .map((card) => card.offsetLeft - snapPaddingPx)
        .filter((target) => target <= maxScrollLeft + 1)
        .map((target) => Math.max(0, target))
    }

    function clearOverscroll(el: HTMLElement, animated: boolean) {
      clearTimeout(overscrollResetTimer)
      if (!el.style.transform) {
        el.style.transition = ''
        return
      }
      if (animated) {
        el.style.transition = `transform ${OVERSCROLL_RETURN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        el.style.transform = ''
        overscrollResetTimer = setTimeout(() => {
          el.style.transition = ''
        }, OVERSCROLL_RETURN_MS + 20)
      } else {
        el.style.transition = ''
        el.style.transform = ''
      }
    }

    function handleMouseDown(event: MouseEvent) {
      if (event.button !== 0) return
      const el = containerRef.current
      if (!el) return
      isDragging = true
      didDrag = false
      startX = event.clientX
      startScrollLeft = el.scrollLeft
      moveSamples = [{ x: event.clientX, t: performance.now() }]
      el.classList.add('cursor-grabbing')
      document.body.classList.add('select-none')
      // CSS scroll-snap fights a free-form drag — suspend it for the
      // duration (and cancel any pending restore/bounce/momentum from a
      // previous release, so grabbing mid-glide stops the list in place).
      cancelPendingSnapRestore(el)
      cancelMomentum()
      clearOverscroll(el, false)
      el.style.scrollSnapType = 'none'
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDragging) return
      const el = containerRef.current
      if (!el) return
      const deltaX = event.clientX - startX
      if (Math.abs(deltaX) > 3) didDrag = true

      const now = performance.now()
      moveSamples.push({ x: event.clientX, t: now })
      moveSamples = moveSamples.filter((sample) => now - sample.t <= VELOCITY_SAMPLE_WINDOW_MS)

      const desired = startScrollLeft - deltaX
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      el.scrollLeft = Math.min(maxScrollLeft, Math.max(0, desired))

      // 邊界外的拖曳量以阻尼位移呈現（rubber-band），方向與手勢一致。
      let overshoot = 0
      if (desired < 0) {
        overshoot = -desired
      } else if (desired > maxScrollLeft) {
        overshoot = -(desired - maxScrollLeft)
      }
      if (overshoot !== 0) {
        const damped =
          Math.sign(overshoot) *
          Math.min(OVERSCROLL_MAX_PX, Math.abs(overshoot) * OVERSCROLL_RESISTANCE)
        el.style.transition = ''
        el.style.transform = `translateX(${damped}px)`
      } else if (el.style.transform) {
        el.style.transform = ''
      }
    }

    function stopDragging() {
      if (!isDragging) return
      isDragging = false
      const el = containerRef.current
      if (!el) return
      el.classList.remove('cursor-grabbing')
      document.body.classList.remove('select-none')
      clearOverscroll(el, true)

      if (!didDrag) {
        el.style.scrollSnapType = ''
        return
      }

      const targets = cardTargets(el)
      if (targets.length === 0) {
        el.style.scrollSnapType = ''
        return
      }

      const current = el.scrollLeft
      const delta = current - startScrollLeft
      const maxScrollLeft = el.scrollWidth - el.clientWidth

      // 快甩（fling）：依放開速度投影滑行距離，停在投影點附近的卡片邊界
      //（不逆行、至少過一張），投影落在末端自由區則自由停放。
      const velocity = releaseVelocity()
      if (Math.abs(velocity) >= FLING_VELOCITY_PX_PER_MS) {
        const projected = Math.min(
          maxScrollLeft,
          Math.max(0, current + velocity * MOMENTUM_PROJECTION_MS),
        )
        const nearestToProjected = targets.reduce(
          (best, target) =>
            Math.abs(target - projected) < Math.abs(best - projected) ? target : best,
          targets[0],
        )
        let destination: number
        if (Math.abs(nearestToProjected - projected) > FREE_ZONE_DISTANCE_PX) {
          destination = projected
        } else if (velocity > 0) {
          const firstAhead = targets.find((target) => target > current + 1)
          destination = firstAhead === undefined ? projected : Math.max(nearestToProjected, firstAhead)
        } else {
          const firstBehind =
            [...targets].reverse().find((target) => target < current - 1) ?? 0
          destination = Math.min(nearestToProjected, firstBehind)
        }
        const distance = destination - current
        if (Math.abs(distance) > 1) {
          const duration = Math.min(
            MOMENTUM_MAX_DURATION_MS,
            Math.max(MOMENTUM_MIN_DURATION_MS, (Math.abs(distance) / Math.abs(velocity)) * 2),
          )
          animateScrollTo(el, destination, duration)
        }
        restoreSnapAfterSettle(el)
        return
      }

      const nearest = targets.reduce(
        (best, target) => (Math.abs(target - current) < Math.abs(best - current) ? target : best),
        targets[0],
      )

      // 放開處離所有邊界都很遠（列表末端自由區）→ 停在原地，不自動靠右。
      if (Math.abs(nearest - current) > FREE_ZONE_DISTANCE_PX) {
        restoreSnapAfterSettle(el)
        return
      }

      let destination = nearest
      if (delta > DIRECTION_INTENT_THRESHOLD_PX) {
        // 前進：至少停在「起點之後的第一個卡片邊界」，不得彈回起點；末端
        // 已無邊界時停在原地。
        const firstAhead = targets.find((target) => target > startScrollLeft + 1)
        destination = firstAhead === undefined ? current : Math.max(nearest, firstAhead)
      } else if (delta < -DIRECTION_INTENT_THRESHOLD_PX) {
        // 後退：至少停在「起點之前的第一個卡片邊界」。
        const firstBehind =
          [...targets].reverse().find((target) => target < startScrollLeft - 1) ?? 0
        destination = Math.min(nearest, firstBehind)
      }

      if (Math.abs(destination - current) > 1) {
        el.scrollTo({ left: destination, behavior: 'smooth' })
      }
      restoreSnapAfterSettle(el)
    }

    function handleClickCapture(event: MouseEvent) {
      if (didDrag) {
        event.preventDefault()
        event.stopPropagation()
        didDrag = false
      }
    }

    // Cards that render as <Link> (anchor) elements have native browser
    // drag-a-link behavior (e.g. dragging out a bookmark) — that hijacks the
    // gesture into a native HTML5 drag instead of our mousemove-based one,
    // so the relation list (whose cards are links) never receives the
    // mousemove updates needed to scroll. Block it.
    function handleDragStart(event: DragEvent) {
      event.preventDefault()
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopDragging)
    container.addEventListener('click', handleClickCapture, true)
    container.addEventListener('dragstart', handleDragStart)

    return () => {
      cancelPendingSnapRestore(container)
      cancelMomentum()
      clearTimeout(overscrollResetTimer)
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopDragging)
      container.removeEventListener('click', handleClickCapture, true)
      container.removeEventListener('dragstart', handleDragStart)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, snapPaddingPx, ...deps])
}
