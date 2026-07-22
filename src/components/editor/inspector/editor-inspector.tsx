import { hasKeyframeTrack, resolveElementAtTime, type AnimatableProperty } from '@/engine'
import { ShapeInspector } from '@/components/editor/inspector/shape-inspector'
import { TextInspector } from '@/components/editor/inspector/text-inspector'
import { VideoInspector } from '@/components/editor/inspector/video-inspector'
import { roundTo } from '@/lib/utils'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'

function EditorInspector() {
  const { project, updateElement, addKeyframe, clearKeyframeTrack, setElementMeta, patchElementMeta } =
    useScene()
  const { selectedElementId } = useSelection()
  const { currentTime } = usePlayback()
  const baseElement = project.elements.find((candidate) => candidate.id === selectedElementId)

  if (!baseElement) return null

  const element = resolveElementAtTime(baseElement, currentTime)

  const writeProperty = (property: AnimatableProperty, value: number | string) => {
    if (hasKeyframeTrack(baseElement, property)) {
      addKeyframe(baseElement.id, property, currentTime, value)
    } else {
      updateElement(baseElement.id, { [property]: value })
    }
  }

  const toggleTrack = (property: AnimatableProperty, currentValue: number | string) => {
    if (hasKeyframeTrack(baseElement, property)) {
      clearKeyframeTrack(baseElement.id, property)
    } else {
      addKeyframe(baseElement.id, property, currentTime, currentValue)
    }
  }

  const setNumber = (
    key: 'x' | 'y' | 'width' | 'height' | 'rotation' | 'opacity' | 'fontSize',
    value: string,
  ) => {
    const parsed = Number.parseFloat(value)
    if (Number.isNaN(parsed)) return
    writeProperty(key, roundTo(parsed))
  }

  // element is derived from baseElement via resolveElementAtTime, which always
  // preserves `.type` — narrowing on baseElement first, then element with its
  // own guard, lets TS narrow both without a compound (&&) condition, which it
  // can't carry past the block.
  if (baseElement.type === 'text') {
    if (element.type !== 'text') return null
    return (
      <TextInspector
        element={element}
        baseElement={baseElement}
        environment={project.environment}
        writeProperty={writeProperty}
        toggleTrack={toggleTrack}
        setNumber={setNumber}
        updateElement={updateElement}
        setElementMeta={setElementMeta}
      />
    )
  }

  if (baseElement.type === 'video') {
    if (element.type !== 'video') return null
    return (
      <VideoInspector
        element={element}
        baseElement={baseElement}
        environment={project.environment}
        writeProperty={writeProperty}
        toggleTrack={toggleTrack}
        setNumber={setNumber}
        updateElement={updateElement}
        setElementMeta={setElementMeta}
        patchElementMeta={patchElementMeta}
      />
    )
  }

  // Only Shape is left at this point (baseElement.type narrowed by elimination).
  if (element.type !== 'shape') return null

  return (
    <ShapeInspector
      element={element}
      baseElement={baseElement}
      environment={project.environment}
      writeProperty={writeProperty}
      toggleTrack={toggleTrack}
      setNumber={setNumber}
      updateElement={updateElement}
      setElementMeta={setElementMeta}
    />
  )
}

export { EditorInspector }
