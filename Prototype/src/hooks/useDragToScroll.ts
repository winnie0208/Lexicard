import { useEffect, type DependencyList, type RefObject } from 'react'

// Lets desktop users grab-and-drag a horizontal-only carousel with the mouse
// (no trackpad or horizontal wheel needed). Tracks whether a real drag
// happened so a plain click (e.g. opening a card) still passes through
// untouched — only drags past a small threshold are treated as scrolling.
//
// `deps` should include whatever makes the container go from unmounted to
// mounted (e.g. the list's length) — see useSnapAlign for why.
export function useDragToScroll(
  containerRef: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isDragging = false
    let didDrag = false
    let startX = 0
    let startScrollLeft = 0

    function handleMouseDown(event: MouseEvent) {
      if (event.button !== 0) return
      const el = containerRef.current
      if (!el) return
      isDragging = true
      didDrag = false
      startX = event.clientX
      startScrollLeft = el.scrollLeft
      el.classList.add('cursor-grabbing')
      document.body.classList.add('select-none')
      // CSS scroll-snap fights a free-form drag — it keeps nudging the
      // position toward the nearest card on every scrollLeft change, which
      // is what makes the drag feel like it's moving in steps instead of
      // 1:1 with the mouse. Suspend it for the duration of the drag; the
      // debounced useSnapAlign correction re-settles it after release.
      el.style.scrollSnapType = 'none'
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDragging) return
      const el = containerRef.current
      if (!el) return
      const deltaX = event.clientX - startX
      if (Math.abs(deltaX) > 3) didDrag = true
      el.scrollLeft = startScrollLeft - deltaX
    }

    function stopDragging() {
      isDragging = false
      const el = containerRef.current
      el?.classList.remove('cursor-grabbing')
      document.body.classList.remove('select-none')
      if (el) el.style.scrollSnapType = ''
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
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopDragging)
      container.removeEventListener('click', handleClickCapture, true)
      container.removeEventListener('dragstart', handleDragStart)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps])
}
