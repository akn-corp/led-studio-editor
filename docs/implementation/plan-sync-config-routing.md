# Plan — Sync config Routing Hub & Preview

> Objectif : le Studio reste une app d’authoring. Il récupère le mapping mur depuis le Hub (fichier puis **API HTTP**), configure host/port, et envoie du `LEDS` — sans dupliquer Excel/DMX.

## État actuel (baseline)

| Élément | Aujourd’hui |
|---------|-------------|
| Mapping mur | [`src/config/wall-bands.json`](../../src/config/wall-bands.json) **statique**, bundlé au build |
| Host / port Hub | Hardcodés `127.0.0.1:6455` dans [`use-preview.ts`](../../src/hooks/use-preview.ts) |
| Import Excel / mur-led | Aucun |
| Interrogation Hub | Aucune |
| UI Settings | Absente |

Fichiers clés :

- [`src/engine/wall-mapping.ts`](../../src/engine/wall-mapping.ts) — import JSON statique
- [`electron/preview-ipc.ts`](../../electron/preview-ipc.ts) — UDP send
- [`src/hooks/use-preview.ts`](../../src/hooks/use-preview.ts) — boucle 40 Hz
- [`src/components/editor/navbar/editor-navbar.tsx`](../../src/components/editor/navbar/editor-navbar.tsx)

**Dépendance Hub** : voir `led-routing-hub/docs/implementation/plan-installation-et-profils.md`  
(P0 = dériver wall-bands, **P4 = API HTTP** `/api/wall-bands`).

---

## Architecture cible

```
┌─────────────────────┐
│  led-routing-hub    │
│  profil actif       │
└─────────┬───────────┘
          │
          ├─ GET :6456/api/wall-bands ──► mapping authoring
          │
          └─ UDP :6455 LEDS ◄────────── state (couleurs)
                    ▲
┌───────────────────┴───┐
│  led-studio-editor    │
│  + cache local        │
└───────────────────────┘
```

Fallback si Hub down : dernier `wall-bands` en cache (userData) ou JSON embarqué.

---

## Phases

### S0 — Runtime wall-bands (1–2 j)

**But** : pouvoir remplacer le mapping sans rebuild.

1. `setWallMapping` / `getWallMapping` dans `wall-mapping.ts`
2. Même source côté Electron (`preview:setWallBands`)
3. Persist userData + fallback JSON embarqué
4. Tests adaptés

**Critères** : preview OK avec défaut ; mapping injecté suivi par chunks ; `pnpm test` vert.

---

### S1 — Settings + import fichier (2 j)

**But** : brancher le Studio sans attendre l’API Hub (TTM).

1. Settings : host **state** UDP (6455), host/port **config** HTTP (6456)
2. Importer `wall-bands.json…` (file picker) + résumé + restaurer défaut
3. Persist settings
4. Indicateur Preview : cible UDP

**Critères** : import fichier Hub export → preview OK ; settings persistés.

---

### S2 — Alignement Preview (0.5–1 j)

1. Au `preview:start` : sync mapping vers le main
2. Logs : chunks, entities, target
3. Bloquer Preview si mapping vide

---

### S3 — Interroger le Hub (API) (1–2 j)

**But** : plus besoin du file picker au quotidien. Dépend de **Hub P4**.

#### UX

- Bouton **« Sync depuis le Hub »** (Settings / navbar)
- Option **« Sync auto au démarrage Preview »** (défaut ON)
- États : Hub OK / Hub unreachable (garde le cache) / mapping mis à jour

#### Tâches

1. `fetch(`${configBaseUrl}/api/health`)` puis `/api/wall-bands`
2. Valider schéma → `setWallMapping` → persist cache
3. Afficher `active-profile` si dispo
4. Ne pas confondre ports : UDP 6455 (LEDS) ≠ HTTP 6456 (config)

#### Critères d’acceptation

- [ ] Hub tourne → Sync charge le wall-bands du profil actif
- [ ] Hub down → message clair + cache conservé, Preview possible
- [ ] Changement de profil Hub → Sync → nouveaux chunks
- [ ] Import fichier reste disponible (fallback / offline)

#### Fichiers touchés

| Fichier | Action |
|---------|--------|
| `src/engine/hub-config-client.ts` | Créer (fetch + validate) |
| Settings UI | Bouton Sync + URL config |
| `use-preview.ts` | Sync optionnelle avant start |
| Tests | Mock fetch health / wall-bands |

---

### S4 — Confort (optionnel)

| Item | Notes |
|------|-------|
| Drag & drop `wall-bands.json` | Offline rapide |
| Polling léger health | Badge vert/rouge dans la navbar |
| Save / Export projet scène | Autre plan |

---

## Hors scope

- Éditer `mur-led.json` / Excel dans le Studio
- Multi-profils côté Studio (liste gérée par le Hub)
- Remplacer le protocole LEDS
- WebSocket push (fetch à la demande suffit)

---

## Ordre de livraison & dépendance Hub

```
Hub P0 (dériver wall-bands)
   │
   ▼
Studio S0 → S1 (fichier) → S2
   │
Hub P4 (API HTTP)
   │
   ▼
Studio S3 (fetch /api/wall-bands) → S4
```

Unity suit le même contrat S3 : `UnityWebRequest` → `WallMapping` + cache Resources/user.

---

## Tests

| Test | Phase |
|------|-------|
| wall-mapping injecté | S0 |
| Validation import fichier | S1 |
| encodeLedFrame / chunks | S0/S2 |
| hub-config-client (mock) | S3 |
| `pnpm test` | toutes |

---

## Checklist démo

1. Hub démarré (moteur + API `:6456`)
2. Studio : Sync depuis le Hub (ou import fichier si P4 pas prêt)
3. Preview ON → mur / moniteur DMX
4. Changer de profil Hub → Sync → vérifier le mapping
5. Couper le Hub → Studio garde le cache, message d’état
