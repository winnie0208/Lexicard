import { useEffect, type DependencyList, type RefObject } from 'react'

// Watches a horizontally-scrollable container and, once scrolling settles,
// actively corrects the position so the leftmost card's start edge lines up
// with the container's left padding — a JS-enforced backstop for cases where
// CSS scroll-snap + scroll-padding alone don't land reliably (seen on some
// mobile browsers in this app's carousels).
//
// `deps` should include whatever makes the container go from unmounted to
// mounted (e.g. the list's length) — the ref itself never changes identity,
// so without this the effect can run once while the element is still absent
// (data still loading) and never attach anything.
export function useSnapAlign(
  containerRef: RefObject<HTMLElement | null>,
  paddingPx: number,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let settleTimer: ReturnType<typeof setTimeout>
    // JS 校正是為觸控瀏覽器的原生捲動準備；桌機滑鼠拖曳已有
    // useDragToScroll 決定方向與停點，若這裡再找「最近卡片」會把結果拉回。
    // 以最近一次實際輸入來源分流，比單看裝置媒體查詢更能支援觸控筆電。
    let shouldAlign = window.matchMedia('(pointer: coarse)').matches

    function alignToNearestCard() {
      if (!shouldAlign) return
      const el = containerRef.current
      if (!el) return
      const cards = Array.from(el.children) as HTMLElement[]
      if (cards.length === 0) return

      // Clamp candidate targets to the scrollable range — otherwise the last
      // card's "ideal" start-aligned position can exceed what's actually
      // scrollable (no room after it), so at true max scroll its distance
      // never reads as 0 and an earlier card wins by mistake, yanking the
      // view backward and hiding the last card.
      const maxScrollLeft = el.scrollWidth - el.clientWidth

      let closest = cards[0]
      let closestDistance = Infinity
      for (const card of cards) {
        const idealTarget = Math.min(Math.max(0, card.offsetLeft - paddingPx), maxScrollLeft)
        const distance = Math.abs(idealTarget - el.scrollLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closest = card
        }
      }

      // Skip the correction once the last card is the nearest one — forcing
      // its start edge flush to the left padding here would yank the view
      // away from wherever the user chose to stop near the end of the list.
      if (closest === cards[cards.length - 1]) return

      const target = Math.min(Math.max(0, closest.offsetLeft - paddingPx), maxScrollLeft)
      if (Math.abs(target - el.scrollLeft) > 1) {
        el.scrollTo({ left: target, behavior: 'smooth' })
      }
    }

    function handleScroll() {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(alignToNearestCard, 120)
    }

    function handlePointerDown(event: PointerEvent) {
      shouldAlign = event.pointerType === 'touch' || event.pointerType === 'pen'
      if (!shouldAlign) clearTimeout(settleTimer)
    }

    function handleWheel() {
      shouldAlign = false
      clearTimeout(settleTimer)
    }

    container.addEventListener('pointerdown', handlePointerDown, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(settleTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, paddingPx, ...deps])
}
