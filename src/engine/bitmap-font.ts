import type { Rgb } from '@/engine/rasterize-leds'
import type { ColorGrid } from '@/engine/rasterize-scene'

/** Classic 5×7 LED font — each row is 5 bits (MSB = left). */
export const FONT_5X7: Record<string, readonly number[]> = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '!': [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
  '.': [0, 0, 0, 0, 0, 0b00100, 0b00100],
  '-': [0, 0, 0, 0b11111, 0, 0, 0],
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  '3': [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'B': [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  'C': [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  'D': [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  'E': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  'F': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  'G': [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'I': [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  'J': [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  'N': [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  'O': [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'P': [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  'Q': [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  'R': [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  'S': [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  'X': [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  'Y': [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  'Z': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
}

const GLYPH_WIDTH = 5
const GLYPH_HEIGHT = 7
const CHAR_SPACING = 1

function glyphFor(char: string): readonly number[] {
  return FONT_5X7[char.toUpperCase()] ?? FONT_5X7[' ']
}

function setGridCell(
  grid: ColorGrid,
  rows: number,
  columns: number,
  row: number,
  column: number,
  color: Rgb,
) {
  if (row < 0 || row >= rows || column < 0 || column >= columns) return
  grid[row][column] = color
}

interface GlyphBlock {
  blockX: number
  blockY: number
}

/**
 * Walks every lit pixel of a text string's glyphs, in unscaled/unrotated
 * block-grid units (one unit = one font "pixel"). This is the single
 * source of truth for the font's bit-layout + advance-width logic — the
 * grid painter (below) and the on-canvas ghost-preview painter both plot
 * these same blocks, just through different sinks (grid cells vs. canvas
 * fillRect), so the preview can never silently drift from what actually
 * lights up.
 */
function* walkGlyphBlocks(text: string): Generator<GlyphBlock> {
  let penX = 0
  for (const char of text) {
    const glyph = glyphFor(char)
    for (let row = 0; row < GLYPH_HEIGHT; row += 1) {
      const rowBits = glyph[row] ?? 0
      for (let col = 0; col < GLYPH_WIDTH; col += 1) {
        if ((rowBits & (1 << (GLYPH_WIDTH - 1 - col))) === 0) continue
        yield { blockX: penX + col, blockY: row }
      }
    }
    penX += GLYPH_WIDTH + CHAR_SPACING
  }
}

export function paintBitmapTextToGrid(
  grid: ColorGrid,
  rows: number,
  columns: number,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  rotationDeg: number,
  color: Rgb,
) {
  const blockScale = Math.max(1, Math.round(fontSize))
  const rotationRad = (rotationDeg * Math.PI) / 180
  const cos = Math.cos(rotationRad)
  const sin = Math.sin(rotationRad)

  for (const { blockX, blockY } of walkGlyphBlocks(text)) {
    // Rotation is applied per output pixel (not via a single whole-text
    // transform) because grid cells are discrete integer positions —
    // each sub-pixel of a scaled block can land in a different rotated
    // cell, unlike the canvas painter below which can lean on the
    // canvas's own transform stack.
    for (let dy = 0; dy < blockScale; dy += 1) {
      for (let dx = 0; dx < blockScale; dx += 1) {
        const localX = blockX * blockScale + dx
        const localY = blockY * blockScale + dy
        const worldX = x + localX * cos - localY * sin
        const worldY = y + localX * sin + localY * cos
        setGridCell(grid, rows, columns, Math.floor(worldY), Math.floor(worldX), color)
      }
    }
  }
}

export function measureBitmapText(text: string, fontSize: number) {
  const blockScale = Math.max(1, Math.round(fontSize))
  const advance = (GLYPH_WIDTH + CHAR_SPACING) * blockScale
  return {
    width: Math.max(advance, text.length * advance),
    height: GLYPH_HEIGHT * blockScale,
  }
}

interface BitmapPaintContext {
  save(): void
  restore(): void
  globalAlpha: number
  fillStyle: string | CanvasGradient | CanvasPattern
  translate(x: number, y: number): void
  rotate(angle: number): void
  fillRect(x: number, y: number, width: number, height: number): void
}

export function paintBitmapTextToContext(
  context: BitmapPaintContext,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  rotationDeg: number,
  fillStyle: string,
  opacity: number,
  cellSize: number,
) {
  const blockScale = Math.max(1, Math.round(fontSize))

  context.save()
  context.globalAlpha = opacity
  context.fillStyle = fillStyle
  if (x !== 0 || y !== 0) {
    context.translate(x * cellSize, y * cellSize)
  }
  if (rotationDeg !== 0) {
    context.rotate((rotationDeg * Math.PI) / 180)
  }

  for (const { blockX, blockY } of walkGlyphBlocks(text)) {
    context.fillRect(
      blockX * blockScale * cellSize,
      blockY * blockScale * cellSize,
      blockScale * cellSize,
      blockScale * cellSize,
    )
  }

  context.restore()
}

export { GLYPH_WIDTH, GLYPH_HEIGHT, CHAR_SPACING }
