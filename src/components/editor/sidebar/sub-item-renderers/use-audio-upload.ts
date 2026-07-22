import { useCallback, useRef, type ChangeEvent } from 'react'
import type { AudioTrack } from '@/engine'
import { useScene } from '@/state/use-scene'

async function readDuration(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer()
  const audioContext = new AudioContext()
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer.duration
  } finally {
    await audioContext.close()
  }
}

function useAudioUpload() {
  const { setAudio } = useScene()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      const filePath = window.electronAPI?.getPathForFile?.(file)
      if (!filePath) {
        console.error('[audio] could not resolve a file path — is this running in Electron?')
        return
      }

      let duration = 0
      try {
        duration = await readDuration(file)
      } catch (error) {
        console.error('[audio] failed to read duration:', error)
      }

      const audio: AudioTrack = { fileName: file.name, filePath, duration }
      setAudio(audio)
    },
    [setAudio],
  )

  return { inputRef, openPicker, handleFileSelected }
}

export { useAudioUpload }
