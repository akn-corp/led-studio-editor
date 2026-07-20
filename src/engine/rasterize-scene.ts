import { isPointInElement } from '@/engine/coverage'
import { paintBitmapTextToGrid } from '@/engine/bitmap-font'
import { computeFitTransform } from '@/engine/fit-transform'
import { hexToRgb, type Rgb } from '@/engine/rasterize-leds'
import type { SquareElement, TextElement, VideoElement } from '@/engine/model/element'
import type { Project } from '@/engine/model/project'

export type ColorGrid = (Rgb | null)[][]

export interface ComposeColorGridOptions {
  getVideoElement?: (elementId: string) => HTMLVideoElement | null
}

const MAX_VIDEO_SAMPLE_SIZE = 64
// Reused across calls/elements — one drawImage + one getImageData per video
// element per composeColorGrid call, not one per LED cell.
let sampleCanvas: HTMLCanvasElement | null = null

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

const clamp255 = (value: number) => Math.min(255, Math.max(0, value))

/**
 * Simplified fidelity by design: honors Fit/Crop/Brightness (so the sampled
 * region and its exposure match the live preview), but Filter Preset stays
 * preview-only and doesn't affect the exported per-LED colors.
 */
function applyVideoToGrid(
  grid: ColorGrid,
  rows: number,
  columns: number,
  element: VideoElement,
  videoEl: HTMLVideoElement | null,
): void {
  if (!videoEl || videoEl.readyState < videoEl.HAVE_CURRENT_DATA) return
  const videoWidth = videoEl.videoWidth
  const videoHeight = videoEl.videoHeight
  if (videoWidth <= 0 || videoHeight <= 0) return

  const crop = element.crop ?? { x: 0, y: 0, width: 1, height: 1 }
  const cropX = crop.x * videoWidth
  const cropY = crop.y * videoHeight
  const cropWidth = Math.max(1, crop.width * videoWidth)
  const cropHeight = Math.max(1, crop.height * videoHeight)

  const canvasWidth = Math.max(1, Math.min(MAX_VIDEO_SAMPLE_SIZE, Math.ceil(element.width)))
  const canvasHeight = Math.max(1, Math.min(MAX_VIDEO_SAMPLE_SIZE, Math.ceil(element.height)))

  if (!sampleCanvas) sampleCanvas = document.createElement('canvas')
  sampleCanvas.width = canvasWidth
  sampleCanvas.height = canvasHeight
  const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  const { drawWidth, drawHeight, offsetX, offsetY } = computeFitTransform({
    sourceWidth: cropWidth,
    sourceHeight: cropHeight,
    destWidth: canvasWidth,
    destHeight: canvasHeight,
    fit: element.fit,
  })

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.drawImage(videoEl, cropX, cropY, cropWidth, cropHeight, offsetX, offsetY, drawWidth, drawHeight)

  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data
  } catch (error) {
    // A tainted/unreadable canvas for this one video shouldn't take down the
    // whole grid — every other element still renders normally.
    console.error('[video] could not sample frame for the LED grid:', error)
    return
  }

  const alpha = element.opacity ?? 1
  const brightness = element.brightness ?? 1

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const pointX = column + 0.5
      const pointY = row + 0.5
      const dx = pointX - element.x
      const dy = pointY - element.y
      const theta = (element.rotation * Math.PI) / 180
      const cos = Math.cos(theta)
      const sin = Math.sin(theta)
      const localX = dx * cos + dy * sin
      const localY = -dx * sin + dy * cos
      if (localX < 0 || localX > element.width || localY < 0 || localY > element.height) continue

      const canvasX = Math.min(canvasWidth - 1, Math.max(0, Math.floor((localX / element.width) * canvasWidth)))
      const canvasY = Math.min(canvasHeight - 1, Math.max(0, Math.floor((localY / element.height) * canvasHeight)))
      const index = (canvasY * canvasWidth + canvasX) * 4
      const pixelAlpha = data[index + 3]
      if (pixelAlpha === 0) continue // letterboxed area (fit: 'contain')

      grid[row][column] = {
        r: clamp255(Math.round(data[index] * brightness * alpha)),
        g: clamp255(Math.round(data[index + 1] * brightness * alpha)),
        b: clamp255(Math.round(data[index + 2] * brightness * alpha)),
      }
    }
  }
}

function composeColorGrid(project: Project, options: ComposeColorGridOptions = {}): ColorGrid {
  const { rows, columns } = project.environment
  const grid: ColorGrid = Array.from({ length: rows }, () =>
    Array<Rgb | null>(columns).fill(null),
  )

  for (const element of project.elements) {
    if (element.type === 'square') {
      applySquareToGrid(grid, rows, columns, element)
    } else if (element.type === 'text') {
      applyTextToGrid(grid, rows, columns, element)
    } else if (element.type === 'video') {
      applyVideoToGrid(grid, rows, columns, element, options.getVideoElement?.(element.id) ?? null)
    }
  }

  return grid
}

function rgbToCss(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export { composeColorGrid, rgbToCss }
