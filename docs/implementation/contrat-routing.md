# Contrat Studio ↔ Routing Hub

Miroir de `led-routing-hub/docs/implementation/contrat-authoring.md`.

## Rôle du Studio

- Authoring : scène, éléments, timeline, preview
- Récupérer le mapping mur depuis le Hub :
  1. **API** `GET http://hub:6456/api/wall-bands` (cible)
  2. Fallback : import fichier / cache local / JSON embarqué
- Envoi UDP `LEDS` ~40 Hz vers `:6455`

## Canaux

| Canal | Port | Rôle |
|-------|------|------|
| Config | HTTP **6456** | Interroger `wall-bands` / health / profil |
| State | UDP **6455** | Couleurs LEDS |

## Ce que le Studio ne fait pas

- Parser Excel / éditer `mur-led.json`
- Connaître IP BC216, univers, canaux DMX
- Gérer la liste des profils (le Hub décide le profil actif)

## Mapping spatial

- Runtime : `setWallMapping` / `getWallMapping` ([`wall-mapping.ts`](../../src/engine/wall-mapping.ts))
- Défaut embarqué : [`src/config/wall-bands.json`](../../src/config/wall-bands.json)

## Réseau state (inchangé)

Code : [`electron/preview-ipc.ts`](../../electron/preview-ipc.ts), [`electron/protocol.ts`](../../electron/protocol.ts), [`src/hooks/use-preview.ts`](../../src/hooks/use-preview.ts)
