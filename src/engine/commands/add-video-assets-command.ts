import type { Command } from '@/engine/commands/command'
import type { Project } from '@/engine/model/project'
import type { VideoAsset } from '@/engine/model/video-asset'

/** One undo step for a whole multi-file upload. */
class AddVideoAssetsCommand implements Command {
  private readonly assets: VideoAsset[]

  constructor(assets: VideoAsset[]) {
    this.assets = assets
  }

  execute(project: Project): Project {
    return { ...project, videoAssets: [...project.videoAssets, ...this.assets] }
  }

  undo(project: Project): Project {
    const addedIds = new Set(this.assets.map((asset) => asset.id))
    return {
      ...project,
      videoAssets: project.videoAssets.filter((asset) => !addedIds.has(asset.id)),
    }
  }
}

export { AddVideoAssetsCommand }
