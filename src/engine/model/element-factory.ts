import type { Environment } from '@/engine/model/environment'
import type { ShapeElement, TextElement, VideoElement } from '@/engine/model/element'
import type { ShapeKind } from '@/engine/shapes/shape-registry'
import type { VideoAsset } from '@/engine/model/video-asset'
import { measureBitmapText } from '@/engine/bitmap-font'

const SHAPE_SIZE = { width: 4, height: 4 }
const DEFAULT_TEXT = 'HELLO'
const DEFAULT_FONT_SIZE = 1
const DEFAULT_CLIP_DURATION = 5
const VIDEO_FOOTPRINT_RATIO = 0.6

function createShapeElement(shapeKind: ShapeKind, environment: Environment, startTime = 0): ShapeElement {
  return {
    id: crypto.randomUUID(),
    type: 'shape',
    shapeKind,
    x: (environment.columns - SHAPE_SIZE.width) / 2,
    y: (environment.rows - SHAPE_SIZE.height) / 2,
    width: SHAPE_SIZE.width,
    height: SHAPE_SIZE.height,
    rotation: 0,
    opacity: 1,
    fill: '#013d9d',
    keyframes: {},
    startTime,
    duration: DEFAULT_CLIP_DURATION,
    hidden: false,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
  }
}

function createTextElement(environment: Environment, startTime = 0): TextElement {
  const { width, height } = measureBitmapText(DEFAULT_TEXT, DEFAULT_FONT_SIZE)
  return {
    id: crypto.randomUUID(),
    type: 'text',
    x: (environment.columns - width) / 2,
    y: (environment.rows - height) / 2,
    width,
    height,
    rotation: 0,
    opacity: 1,
    text: DEFAULT_TEXT,
    fontSize: DEFAULT_FONT_SIZE,
    fill: '#ffffff',
    keyframes: {},
    startTime,
    duration: DEFAULT_CLIP_DURATION,
    hidden: false,
    backgroundColor: null,
    enterAnimation: null,
    loopAnimation: null,
    exitAnimation: null,
  }
}

function createVideoElement(environment: Environment, startTime: number, asset: VideoAsset): VideoElement {
  const aspect = asset.width > 0 && asset.height > 0 ? asset.width / asset.height : 16 / 9
  const maxWidth = environment.columns * VIDEO_FOOTPRINT_RATIO
  const maxHeight = environment.rows * VIDEO_FOOTPRINT_RATIO
  const width = Math.min(maxWidth, maxHeight * aspect)
  const height = width / aspect

  return {
    id: crypto.randomUUID(),
    type: 'video',
    x: (environment.columns - width) / 2,
    y: (environment.rows - height) / 2,
    width,
    height,
    rotation: 0,
    opacity: 1,
    keyframes: {},
    startTime,
    duration: Math.min(asset.duration, DEFAULT_CLIP_DURATION),
    hidden: false,
    fileName: asset.fileName,
    filePath: asset.filePath,
    sourceDuration: asset.duration,
    thumbnailDataUrl: asset.thumbnailDataUrl,
    volume: 1,
    muted: true,
    playbackSpeed: 1,
    fit: 'cover',
    crop: null,
    filterPreset: 'none',
    borderRadius: 0,
    brightness: 1,
    enterAnimation: null,
    exitAnimation: null,
  }
}

export { createShapeElement, createTextElement, createVideoElement }
