import { isPointInElement } from '@/engine/coverage'
import { paintBitmapTextToGrid } from '@/engine/bitmap-font'
import { hexToRgb, type Rgb } from '@/engine/rasterize-leds'
import type { SquareElement, TextElement } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

export type ColorGrid = (Rgb | null)[][]

function applySquareToGrid(
  grid: ColorGrid,
  rows: number,
  columns: number,
  element: SquareElement,
): void {
  const base = hexToRgb(element.fill)
  const alpha = element.opacity ?? 1
  const color: Rgb = {
    r: Math.round(base.r * alpha),
    g: Math.round(base.g * alpha),
    b: Math.round(base.b * alpha),
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (isPointInElement(column + 0.5, row + 0.5, element)) {
        grid[row][column] = color
      }
    }
  }
}

function applyTextToGrid(
  grid: ColorGrid,
  rows: number,
  columns: number,
  element: TextElement,
): void {
  const base = hexToRgb(element.fill)
  const alpha = element.opacity ?? 1
  const color: Rgb = {
    r: Math.round(base.r * alpha),
    g: Math.round(base.g * alpha),
    b: Math.round(base.b * alpha),
  }

  paintBitmapTextToGrid(
    grid,
    rows,
    columns,
    element.text,
    element.x,
    element.y,
    element.fontSize,
    element.rotation,
    color,
  )
}

function composeColorGrid(project: Project): ColorGrid {
  const { rows, columns } = project.environment
  const grid: ColorGrid = Array.from({ length: rows }, () =>
    Array<Rgb | null>(columns).fill(null),
  )

  for (const element of project.elements) {
    if (element.type === 'square') {
      applySquareToGrid(grid, rows, columns, element)
    } else if (element.type === 'text') {
      applyTextToGrid(grid, rows, columns, element)
    }
  }

  return grid
}

function rgbToCss(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export { composeColorGrid, rgbToCss }
