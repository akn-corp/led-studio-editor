export type FitMode = 'cover' | 'contain' | 'fill'

export interface FitTransform {
  drawWidth: number
  drawHeight: number
  offsetX: number
  offsetY: number
}

/**
 * Standard CSS object-fit math: given a source (already-cropped) region and
 * a destination box, compute the drawn size/offset so the source fits per
 * `fit`. Shared by VideoNode's Konva rendering and applyVideoToGrid's LED
 * sampling, so the live preview and the exported per-LED colors agree.
 */
function computeFitTransform(options: {
  sourceWidth: number
  sourceHeight: number
  destWidth: number
  destHeight: number
  fit: FitMode
}): FitTransform {
  const { sourceWidth, sourceHeight, destWidth, destHeight, fit } = options

  if (fit === 'fill' || sourceWidth <= 0 || sourceHeight <= 0) {
    return { drawWidth: destWidth, drawHeight: destHeight, offsetX: 0, offsetY: 0 }
  }

  const sourceAspect = sourceWidth / sourceHeight
  const destAspect = destWidth / destHeight

  const scaleToWidth = destAspect > sourceAspect === (fit === 'cover')

  let drawWidth: number
  let drawHeight: number
  if (scaleToWidth) {
    drawWidth = destWidth
    drawHeight = destWidth / sourceAspect
  } else {
    drawHeight = destHeight
    drawWidth = destHeight * sourceAspect
  }

  return {
    drawWidth,
    drawHeight,
    offsetX: (destWidth - drawWidth) / 2,
    offsetY: (destHeight - drawHeight) / 2,
  }
}

export { computeFitTransform }
