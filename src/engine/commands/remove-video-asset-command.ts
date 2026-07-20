import type { Command } from '@/engine/commands/command'
import type { Project } from '@/engine/model/project'
import type { VideoAsset } from '@/engine/model/video-asset'

class RemoveVideoAssetCommand implements Command {
  private readonly assetId: string
  private previousAssets: VideoAsset[] | null = null

  constructor(assetId: string) {
    this.assetId = assetId
  }

  execute(project: Project): Project {
    this.previousAssets = project.videoAssets
    return {
      ...project,
      videoAssets: project.videoAssets.filter((asset) => asset.id !== this.assetId),
    }
  }

  undo(project: Project): Project {
    if (!this.previousAssets) return project
    return { ...project, videoAssets: this.previousAssets }
  }
}

export { RemoveVideoAssetCommand }
