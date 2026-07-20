export interface VideoAsset {
  id: string
  fileName: string
  filePath: string
  duration: number
  width: number
  height: number
  sizeBytes: number
  thumbnailDataUrl: string | null
}
