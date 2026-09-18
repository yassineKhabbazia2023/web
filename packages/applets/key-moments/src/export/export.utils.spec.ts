import { groupIntoRows } from './export.utils'

/** Only the measured position matters to the grouping; the rest is carried. */
function placed(id: string, top: number, left: number) {
  return { widget: { id }, top, left } as unknown as Parameters<typeof groupIntoRows>[0][number]
}

function readIds(rows: ReturnType<typeof groupIntoRows>): string[][] {
  return rows.map(row => row.map(target => target.widget.id))
}

describe('groupIntoRows', () => {

  it('should read widgets aligned within the tolerance as one row, left to right', () => {
    const rows = groupIntoRows([
      placed('right', 102, 400),
      placed('left', 100, 0),
    ])

    expect(readIds(rows)).toEqual([['left', 'right']])
  })

  it('should split widgets further apart than the tolerance into their own rows', () => {
    const rows = groupIntoRows([
      placed('below', 130, 0),
      placed('above', 100, 0),
    ])

    expect(readIds(rows)).toEqual([['above'], ['below']])
  })

  /**
   * The dense grid climbs a narrow widget into the hole a previous row left:
   * the document order stops saying the reading order, the positions still do.
   */
  it('should put a widget the dense grid moved back in its reading place', () => {
    const rows = groupIntoRows([
      placed('wide-second-row', 140, 0),
      placed('narrow-climbed', 100, 400),
      placed('first', 100, 0),
    ])

    expect(readIds(rows)).toEqual([['first', 'narrow-climbed'], ['wide-second-row']])
  })
})
