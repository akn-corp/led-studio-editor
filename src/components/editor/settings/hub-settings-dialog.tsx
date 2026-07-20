import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { applyWallMapping } from '@/engine/apply-wall-mapping'
import {
  fetchHubActiveProfile,
  fetchHubHealth,
  fetchHubWallBands,
  parseWallBandsJson,
} from '@/engine/hub-config-client'
import { getWallMapping, resetWallMapping } from '@/engine/wall-mapping'
import { updateHubSettings, useHubSettings } from '@/state/use-hub-settings'
import { RefreshCw, Settings } from 'lucide-react'

function HubSettingsDialog() {
  const settings = useHubSettings()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const mapping = getWallMapping()

  async function syncFromHub() {
    setBusy(true)
    setMessage(null)
    try {
      const health = await fetchHubHealth(settings.configBaseUrl)
      const profile = await fetchHubActiveProfile(settings.configBaseUrl).catch(() => null)
      const wallBands = await fetchHubWallBands(settings.configBaseUrl)
      await applyWallMapping(wallBands)
      setMessage(
        `Sync OK — ${wallBands.columns} colonnes` +
          (profile ? `, profil ${profile.label}` : '') +
          (health.running ? ' (moteur actif)' : ' (moteur arrêté)'),
      )
    } catch (err) {
      setMessage(`Hub unreachable — ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setBusy(false)
    }
  }

  async function onImportFile(file: File) {
    setBusy(true)
    setMessage(null)
    try {
      const text = await file.text()
      const wallBands = parseWallBandsJson(text)
      await applyWallMapping(wallBands)
      setMessage(`Import OK — ${wallBands.columns} colonnes depuis ${file.name}`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function restoreDefault() {
    setBusy(true)
    setMessage(null)
    try {
      const wallBands = resetWallMapping()
      await applyWallMapping(wallBands)
      setMessage('Mapping par défaut restauré')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="icon" title="Hub settings" />}>
        <Settings className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Routing Hub</DialogTitle>
          <DialogDescription>
            State UDP :6455 · Config HTTP :6456 — le Studio interroge le Hub pour le mapping mur.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="state-host">State host (UDP)</Label>
            <Input
              id="state-host"
              value={settings.stateHost}
              onChange={(e) => updateHubSettings({ stateHost: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="state-port">State port</Label>
            <Input
              id="state-port"
              type="number"
              value={settings.statePort}
              onChange={(e) => updateHubSettings({ statePort: Number(e.target.value) || 6455 })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="config-url">Config API base URL</Label>
            <Input
              id="config-url"
              value={settings.configBaseUrl}
              onChange={(e) => updateHubSettings({ configBaseUrl: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={settings.syncOnPreviewStart}
              onChange={(e) => updateHubSettings({ syncOnPreviewStart: e.target.checked })}
            />
            Sync auto depuis le Hub au démarrage Preview
          </label>

          <p className="text-xs text-muted-foreground">
            Mapping actuel : {mapping.columns} colonnes
            {mapping.profile ? ` · profil ${mapping.profile}` : ''}
            {mapping.generatedFrom ? ` · ${mapping.generatedFrom}` : ''}
          </p>

          {message ? <p className="text-xs whitespace-pre-wrap">{message}</p> : null}

          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void onImportFile(file)
              e.target.value = ''
            }}
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button disabled={busy} onClick={() => void syncFromHub()}>
            <RefreshCw className="size-4" />
            Sync depuis le Hub
          </Button>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              Importer JSON…
            </Button>
            <Button variant="outline" className="flex-1" disabled={busy} onClick={() => void restoreDefault()}>
              Défaut
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { HubSettingsDialog }
