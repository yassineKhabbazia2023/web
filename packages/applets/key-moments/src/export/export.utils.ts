import { logger } from '@pulse/toolbox'
import { widgetAnchorId } from '../utils/anchor.utils'
import { formatScreenRank } from '../utils/rank.utils'
import {
  CAPTURE_PIXEL_RATIO,
  DRAWN_RENDERERS,
  LAYOUT_SETTLE_DELAY,
  ROW_TOLERANCE,
} from './export.consts'
import type { Report, Widget } from '../types/key-moments.types'
import type { SectionHead, SlideRow, SlideWidget } from './export.types'

/**
 * The only module of the export that reads the page. What it produces is the
 * report laid out in rows, drawings included; everything below works on that,
 * and can be built — and tested — without a DOM.
 */

/** A widget of the report and the element the page drew it in. */
interface ReadTarget {
  head: SectionHead
  widget: Widget
  node: HTMLElement
}

/** Same target, once the page told where it sits. */
interface PlacedTarget extends ReadTarget {
  top: number
  left: number
}

/**
 * A widget far from the viewport is not laid out — `content-visibility: auto`
 * is what keeps the report cheap to scroll — so it sits nowhere and draws
 * nothing. The whole report is therefore forced into layout before anything is
 * measured, and put back as it was afterwards.
 */
function forceLayout(nodes: HTMLElement[]): () => void {
  const previous = nodes.map(node => node.style.contentVisibility)

  nodes.forEach(node => {
    node.style.contentVisibility = 'visible'
  })

  return () => {
    nodes.forEach((node, index) => {
      node.style.contentVisibility = previous[index]
    })
  }
}

function settle(): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, LAYOUT_SETTLE_DELAY)
  })
}

/**
 * The visible widgets of the report, paired with the elements drawing them.
 *
 * The sections are numbered as the client reads them, the hidden ones left out
 * of the count: an exported document that skipped from 02 to 04 would be
 * announcing a section it does not carry.
 */
function collectTargets(report: Report): ReadTarget[] {
  return report.screens
    .filter(screen => screen.isHidden === false)
    .flatMap((screen, rank) => {
      const head: SectionHead = {
        rank: formatScreenRank(rank),
        title: screen.title,
        subtitle: screen.subtitle,
      }

      return screen.widgets
        .filter(widget => widget.isHidden === false)
        .map(widget => ({
          head,
          widget,
          node: document.getElementById(widgetAnchorId(widget.id)),
        }))
        .filter((target): target is ReadTarget => target.node !== null)
    })
}

/**
 * Rows are read off the page rather than deduced from the spans: the grid packs
 * itself `dense`, so a narrow widget climbs into the hole a previous row left
 * and the order of the document stops saying the order of the reading. Sorting
 * on the measured positions is what puts them back in the order they are read.
 */
export function groupIntoRows(targets: PlacedTarget[]): PlacedTarget[][] {
  const sorted = [...targets].sort((left, right) => {
    if (Math.abs(left.top - right.top) > ROW_TOLERANCE) {
      return left.top - right.top
    }

    return left.left - right.left
  })

  return sorted.reduce<PlacedTarget[][]>((rows, target) => {
    const currentRow = rows.at(-1)

    if (currentRow === undefined || Math.abs(target.top - currentRow[0].top) > ROW_TOLERANCE) {
      rows.push([target])

      return rows
    }

    currentRow.push(target)

    return rows
  }, [])
}

/**
 * The element holding the drawing of a widget, which is what gets captured —
 * never the whole widget: its title and its comment are written as text, and
 * capturing them would hand back as a picture what the deck just wrote.
 */
function findDrawing(target: ReadTarget): HTMLElement | null {
  const suffix = DRAWN_RENDERERS[target.widget.renderer]

  if (suffix === undefined) {
    return null
  }

  return target.node.querySelector<HTMLElement>(
    `[data-testid="key-moments-${target.widget.id}-${suffix}"]`,
  )
}

/**
 * Reads the report as the page displays it: the visible widgets, grouped into
 * the rows of the grid, each drawing captured on the way.
 *
 * Sequential on purpose: html-to-image clones the subtree it renders, and a
 * dozen clones held at once is what makes a large report stutter. Only the
 * drawings pay that price now — a table costs nothing to export.
 */
export async function readReport(report: Report): Promise<SlideRow[]> {
  const targets = collectTargets(report)
  const restoreLayout = forceLayout(targets.map(target => target.node))

  try {
    await settle()

    const placed = targets.map(target => {
      const rect = target.node.getBoundingClientRect()

      return { ...target, top: rect.top, left: rect.left }
    })

    const rows: SlideRow[] = []

    for (const row of groupIntoRows(placed)) {
      const widgets: SlideWidget[] = []

      for (const target of row) {
        widgets.push(await readWidget(target))
      }

      rows.push({ head: row[0].head, widgets })
    }

    return rows
  } finally {
    restoreLayout()
  }
}

/**
 * Captures the widget when it is a drawing, hands it over unchanged otherwise.
 * A drawing not yet rendered is handed over without its image (logged, since
 * nothing shows on screen either), and the deck falls back to its figures.
 */
async function readWidget(target: ReadTarget): Promise<SlideWidget> {
  if (DRAWN_RENDERERS[target.widget.renderer] === undefined) {
    return { widget: target.widget }
  }

  const drawing = findDrawing(target)
  const rect = drawing?.getBoundingClientRect()

  if (drawing === null || rect === undefined || rect.width === 0) {
    logger.warn('[KeyMoments] export: the drawing of a widget is not on the page, exported without it', target.widget.id)

    return { widget: target.widget }
  }

  const { toPng } = await import('html-to-image')

  return {
    widget: target.widget,
    aspectRatio: rect.height / rect.width,
    image: await toPng(drawing, { pixelRatio: CAPTURE_PIXEL_RATIO }),
  }
}
