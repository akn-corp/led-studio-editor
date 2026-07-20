import { AddElementCommand } from '@/engine/commands/add-element-command'
import { AddKeyframeCommand } from '@/engine/commands/add-keyframe-command'
import { AddVideoAssetsCommand } from '@/engine/commands/add-video-assets-command'
import { createHistoryManager } from '@/engine/commands/history-manager'
import { MoveKeyframeCommand } from '@/engine/commands/move-keyframe-command'
import { RemoveElementCommand } from '@/engine/commands/remove-element-command'
import { RemoveKeyframeCommand } from '@/engine/commands/remove-keyframe-command'
import { RemoveVideoAssetCommand } from '@/engine/commands/remove-video-asset-command'
import { ResizeEnvironmentCommand } from '@/engine/commands/resize-environment-command'
import { SetAudioCommand } from '@/engine/commands/set-audio-command'
import { SetElementMetaCommand } from '@/engine/commands/set-element-meta-command'
import { UpdateElementCommand } from '@/engine/commands/update-element-command'
import { createEventBus } from '@/engine/events/event-bus'
import type { AudioTrack } from '@/engine/model/audio'
import { DEFAULT_ENVIRONMENT, type Environment } from '@/engine/model/environment'
import type { Element, ElementChanges, ElementMeta } from '@/engine/model/element'
import { resolveElementChanges } from '@/engine/model/element-changes'
import type { AnimatableProperty, EasingType } from '@/engine/model/keyframe'
import type { Project } from '@/engine/model/project'
import type { VideoAsset } from '@/engine/model/video-asset'

const DUPLICATE_OFFSET = 0.5

function createDefaultProject(): Project {
  return {
    id: 'demo-project',
    name: 'Untitled Project',
    environment: { ...DEFAULT_ENVIRONMENT },
    elements: [],
    audio: null,
    videoAssets: [],
  }
}

function createSceneStore() {
  let project = createDefaultProject()
  let selectedElementId: string | null = null
  const events = createEventBus()

  const history = createHistoryManager({
    getProject: () => project,
    setProject: (next) => {
      project = next
      events.emitSceneChanged()
    },
  })

  return {
    getProject: () => project,
    onSceneChanged: events.onSceneChanged,

    getSelectedElementId: () => selectedElementId,
    onSelectionChanged: events.onSelectionChanged,
    setSelectedElementId: (id: string | null) => {
      selectedElementId = id
      events.emitSelectionChanged(id)
    },

    setEnvironment: (environment: Partial<Environment>) => {
      history.execute(new ResizeEnvironmentCommand(environment))
    },
    /** Pass `null` to clear the attached reference audio file. */
    setAudio: (audio: AudioTrack | null) => {
      history.execute(new SetAudioCommand(audio))
    },
    /** One undo step for a whole multi-file upload. */
    addVideoAssets: (assets: VideoAsset[]) => {
      history.execute(new AddVideoAssetsCommand(assets))
    },
    removeVideoAsset: (assetId: string) => {
      history.execute(new RemoveVideoAssetCommand(assetId))
    },
    addElement: (element: Element) => {
      history.execute(new AddElementCommand(element))
    },
    updateElement: (elementId: string, changes: ElementChanges) => {
      history.execute(new UpdateElementCommand(elementId, changes))
    },
    /** Live update without history — used during drag/transform for real-time preview. */
    patchElement: (elementId: string, changes: ElementChanges) => {
      const elements = project.elements.map((element) => {
        if (element.id !== elementId) return element
        const merged = resolveElementChanges(element, changes)
        return { ...element, ...merged } as Element
      })
      project = { ...project, elements }
      events.emitSceneChanged()
    },
    removeElement: (elementId: string) => {
      history.execute(new RemoveElementCommand(elementId))
    },
    setElementMeta: (elementId: string, changes: ElementMeta) => {
      history.execute(new SetElementMetaCommand(elementId, changes))
    },
    /** Live update without history — used while dragging/trimming a clip for real-time preview. */
    patchElementMeta: (elementId: string, changes: ElementMeta) => {
      const elements = project.elements.map((element) =>
        element.id === elementId ? ({ ...element, ...changes } as Element) : element,
      )
      project = { ...project, elements }
      events.emitSceneChanged()
    },
    duplicateElement: (elementId: string): string | null => {
      const original = project.elements.find((element) => element.id === elementId)
      if (!original) return null
      const duplicate: Element = {
        ...original,
        id: crypto.randomUUID(),
        x: original.x + DUPLICATE_OFFSET,
        y: original.y + DUPLICATE_OFFSET,
      }
      history.execute(new AddElementCommand(duplicate))
      return duplicate.id
    },

    addKeyframe: (
      elementId: string,
      property: AnimatableProperty,
      time: number,
      value: number | string,
      easing?: EasingType,
    ) => {
      history.execute(new AddKeyframeCommand(elementId, property, time, value, easing))
    },
    /** Removes a single keyframe if `time` is given, otherwise clears the whole track. */
    removeKeyframe: (elementId: string, property: AnimatableProperty, time?: number) => {
      history.execute(new RemoveKeyframeCommand(elementId, property, time))
    },
    clearKeyframeTrack: (elementId: string, property: AnimatableProperty) => {
      history.execute(new RemoveKeyframeCommand(elementId, property))
    },
    moveKeyframe: (
      elementId: string,
      property: AnimatableProperty,
      fromTime: number,
      toTime: number,
    ) => {
      history.execute(new MoveKeyframeCommand(elementId, property, fromTime, toTime))
    },

    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  }
}

const sceneStore = createSceneStore()

export { sceneStore }
