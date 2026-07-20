import type { Environment } from '@/engine/model/environment'
import type { SquareElement, TextElement, VideoElement } from '@/engine/model/element'
import type { VideoAsset } from '@/engine/model/video-asset'
import { measureBitmapText } from '@/engine/bitmap-font'

const SQUARE_SIZE = { width: 4, height: 4 }
const DEFAULT_TEXT = 'HELLO'
const DEFAULT_FONT_SIZE = 1
const DEFAULT_CLIP_DURATION = 5
const VIDEO_FOOTPRINT_RATIO = 0.6

function createSquareElement(environment: Environment, startTime = 0): SquareElement {
  return {
    id: crypto.randomUUID(),
    type: 'square',
    x: (environment.columns - SQUARE_SIZE.width) / 2,
    y: (environment.rows - SQUARE_SIZE.height) / 2,
    width: SQUARE_SIZE.width,
    height: SQUARE_SIZE.height,
    rotation: 0,
    opacity: 1,
    fill: '#013d9d',
    keyframes: {},
    startTime,
    duration: DEFAULT_CLIP_DURATION,
    hidden: false,
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

export { createSquareElement, createTextElement, createVideoElement }
