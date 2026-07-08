import { useEffect, type DependencyList, type RefObject } from 'react'

// Lets desktop mouse-wheel users scroll a horizontal-only carousel. Without
// this, a normal (vertical) wheel gesture does nothing over a container that
// only overflows horizontally — there's no vertical scroll to hand the delta
// to, so the page just sits still. Trackpad two-finger horizontal swipes
// already arrive as native horizontal scroll and aren't affected.
//
// `deps` should include whatever makes the container go from unmounted to
// mounted (e.g. the list's length) — see useSnapAlign for why.
export function useHorizontalWheelScroll(
  containerRef: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(event: WheelEvent) {
      const el = containerRef.current
      if (!el) return
      if (event.deltaY === 0) return
      event.preventDefault()
      el.scrollLeft += event.deltaY
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps])
}
