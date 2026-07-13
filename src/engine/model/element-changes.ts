import type { Element, ElementChanges, TextElement } from '@/engine/model/element'
import { mergeTextElementChanges } from '@/engine/text-metrics'

/**
 * Normalizes a raw ElementChanges patch against the target element's type —
 * currently this only matters for Text, where font size must stay derived
 * from width/height/text edits. Shared by UpdateElementCommand (undoable)
 * and scene-store's patchElement (live, non-undoable drag preview) so the
 * two mutation paths can't drift on how a change resolves.
 */
export function resolveElementChanges(element: Element, changes: ElementChanges): ElementChanges {
  return element.type === 'text' ? mergeTextElementChanges(element as TextElement, changes) : changes
}
