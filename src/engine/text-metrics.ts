import { GLYPH_HEIGHT, GLYPH_WIDTH, CHAR_SPACING, measureBitmapText } from '@/engine/bitmap-font'
import type { ElementChanges, TextElement } from '@/engine/model/element'

function fontSizeFromHeight(height: number) {
  return Math.max(1, Math.round(height / GLYPH_HEIGHT))
}

function fontSizeFromWidth(text: string, width: number) {
  const charCount = Math.max(1, text.length)
  return Math.max(1, Math.round(width / (charCount * (GLYPH_WIDTH + CHAR_SPACING))))
}

function normalizeTextMetrics(text: string, fontSize: number) {
  const clamped = Math.max(1, Math.round(fontSize))
  return { fontSize: clamped, ...measureBitmapText(text, clamped) }
}

function mergeTextElementChanges(element: TextElement, changes: ElementChanges): ElementChanges {
  const text = changes.text ?? element.text
  const hasHeight = changes.height != null
  const hasWidth = changes.width != null
  const hasFontSize = changes.fontSize != null

  if (!changes.text && !hasHeight && !hasWidth && !hasFontSize) {
    return changes
  }

  let fontSize = hasFontSize ? (changes.fontSize as number) : element.fontSize

  if (!hasFontSize) {
    if (hasHeight && !hasWidth) {
      fontSize = fontSizeFromHeight(changes.height as number)
    } else if (hasWidth && !hasHeight) {
      fontSize = fontSizeFromWidth(text, changes.width as number)
    } else if (hasHeight && hasWidth) {
      fontSize = fontSizeFromHeight(changes.height as number)
    }
  }

  const metrics = normalizeTextMetrics(text, fontSize)
  return { ...changes, text, ...metrics }
}

export { fontSizeFromHeight, fontSizeFromWidth, mergeTextElementChanges, normalizeTextMetrics }
