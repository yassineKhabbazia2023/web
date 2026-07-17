# Tests isolate-safe — la doctrine

Depuis le chantier `feature/tests_rework`, Vitest tourne avec **`isolate: false`**
(voir `packages/@config/vite.config.base.ts`) : les workers sont **partagés entre
les fichiers de test** d'un projet. La suite complète passe ainsi de ~7 min 42 à
~3 min en local, au prix d'une discipline stricte : plus rien n'est remis à zéro
automatiquement entre deux fichiers. Ce document est la référence citée par les
commentaires `doctrine: <slug>` du code (p. ex. `doctrine: shared-dom`).

## Le principe — un worker partagé, zéro état implicite

Tout état posé par un fichier (DOM, globals, modules, mocks) survit pour les
fichiers suivants :

- le **registre de modules** (un module évalué ne l'est plus jamais) ;
- le **document jsdom**, `window`, les globals ;
- les instances de mocks créées au niveau module.

Chaque spec doit donc être écrite comme si elle s'exécutait au milieu de
n'importe quelle séquence de fichiers. Toutes les lois ci-dessous découlent de ce
seul axiome.

## Glossaire

Le vocabulaire utilisé par les lois, défini une fois pour toutes.

- **Worker partagé** — un process Vitest qui enchaîne plusieurs fichiers de test
  sans réinitialiser le registre de modules ni le DOM (`isolate: false`).
- **Hub / hubbé** — un `vi.mock` déclaré une seule fois pour tout un projet dans
  un setup file (le commun `vitest.setup.hubs.ts` pour les quatre hubs
  universels, le `vitest.setup.ts` du projet pour le reste), dont le corps de
  factory est mutualisé dans `vitest.hub-mocks.ts`. Un module « hubbé » est
  mocké worker-wide, pour tous les fichiers.
- **Module contesté** — un module testé **en réel** par sa propre spec mais
  **stubbé** par ses consommateurs. Résolu par spy-wrap + id-split.
- **Spy-wrapped** — chaque export fonction d'un module est remplacé par un
  `vi.fn(realImpl)` : réel par défaut, stubbable par test. Voir
  `spyWrappedModule`.
- **id-split** — mocker l'id du **barrel** (`@pulse/common/api`) tout en
  important le **fichier concret** (`./api`) dans l'own-spec : la spec teste le
  réel pendant que les consommateurs voient le hub.
- **Own-spec** — la spec qui teste un module « pour de vrai », par opposition
  aux specs qui le consomment mocké.
- **Garde-fous** — `setupIsolateSafeGuards()` + `mockReset` : l'hygiène
  automatique qui tourne avant/après chaque test (voir `guardrails`).

## Par où commencer

À l'écriture d'une nouvelle spec, chaque situation ci-dessous renvoie vers la ou
les lois concernées.

1. Le SUT importe un **module partagé** (`@pulse/common/api`, logger, `env-vars`,
   Amplitude, storage, MSAL…) → pas de re-mock local ; le comportement est armé
   via `vi.mocked(...)` dans un `beforeEach` (`shared-hubs`, `guardrails`).
2. Le SUT appelle un manager/service en **classe statique** →
   `vi.spyOn(Classe, 'methode')` par test (`static-classes`).
3. La spec est l'**own-spec** d'un module hubbé → id-split, import du fichier
   concret, et flush de l'async en `afterEach` (`contested-modules`).
4. Un **composant est monté** → jamais au niveau module, toujours dans un
   `beforeEach`/le test ; le démontage est automatique (`shared-dom`).
5. Le **DOM/global partagé** est touché (`window.location`, `document.body`) →
   pas d'écrasement, stub via `vi.stubGlobal`, retrait des seuls nœuds ajoutés
   par la spec (`shared-dom`).
6. **`vi.resetModules()`** est appelé → les mocks sont résolus par
   `await import(...)` **après** le reset (`async-registry`).
7. Un **comportement de mock** est posé → dans un hook, jamais au niveau module
   (`guardrails`) ; un `mockXxxOnce` doit être consommé par le test lui-même
   (`async-registry`).

## Sommaire des lois

- **`shared-hubs`** — les hub mocks sont des factories stables déclarées dans
  les setup files (commun + projet), jamais dans les specs ; leurs spies
  partagés sont mémoïsés sous une forme unique.
- **`guardrails`** — les garde-fous (mockReset + `setupIsolateSafeGuards`)
  tournent avant chaque test ; ils posent aussi le fixture pinia/environnement du
  fichier. La config des mocks vit dans les hooks.
- **`contested-modules`** — spy-wrappés réels par défaut, id-split, flush de
  l'own-spec.
- **`static-classes`** — `vi.spyOn` par test, pas de module mock.
- **`shared-dom`** — DOM & montage partagés : ne rien écraser, tout démonter.
- **`async-registry`** — one-shots consommés, mocks résolus après un reset.
- **`mock-barrel`** — les modules du barrel de mocks n'importent pas de code
  applicatif.

## Les lois

### `shared-hubs` — Hub mocks : factories stables dans le setup, spies mémoïsés, forme unique

Les modules partagés sont mockés **worker-wide** dans un setup file, avec des
factories module-shaped (jamais un automock nu ni un spy-mode comme hub : la
forme du module doit être identique pour tous les fichiers). Les specs
configurent le comportement **par test** via `vi.mocked(...)`.

**Les quatre hubs universels vivent dans un setup file commun.**
`packages/@config/vitest.setup.hubs.ts` (câblé par `vite.config.app.ts`,
`vite.config.applet.ts` et les libraries consommatrices opt-in comme `shared`)
déclare `@pulse/common/api`, `env-vars`, le logger toolbox et Amplitude pour
tous les projets consommateurs. Le `vitest.setup.ts` du projet ne garde que ses
hubs spécifiques, ses spy-wraps locaux et ses **variantes** d'un hub universel
(re-déclarer le même id après le setup commun : l'enregistrement le plus récent
gagne, cf. la variante toolbox `spyWrap` d'entities). Les projets racines des
libraries (`toolbox`, `common`, `styleguide`, `widgets`) ne sont volontairement
pas câblés : ils hébergent les own-specs des modules concernés.

**Les specs ne déclarent jamais de `vi.mock`** (verrouillé par ESLint) : tout
mock de module vit dans un setup file. Deux dérogations sont tolérées, chacune
portée par un `eslint-disable` nominatif avec justification `doctrine:` :

- **id-split d'une own-spec** (voir `contested-modules`) — le cas courant.
- **fixture data-file / script node** — une spec de script de build ou d'un
  utilitaire node (hors chemin jsdom) qui `vi.mock` un fichier de **données**
  (`package.json`, `version.json`) ou un module d'**écriture fs** : hubber ces
  mocks dans le `vitest.setup.ts` les fuirait à tout le worker (jsdom compris)
  sans contention de registre à résoudre. Exemples : `iconGen/utils.spec.ts`,
  `app-version.manager.spec.ts`.

Les setup files sont ré-exécutés pour **chaque fichier de test** ; un module
importé par le setup n'est évalué **qu'une fois par worker**. Un `vi.mock`
placé dans un module importé ne s'enregistrerait donc que pour le premier
fichier — d'où la règle : **le `vi.mock` vit dans le `vitest.setup.ts`**, et
seuls les **corps de factory** sont mutualisés dans
`packages/@config/vitest.hub-mocks.ts`. Chaque setup garde des one-liners :

```ts
vi.mock('@pulse/common/api', () => apiHubMock())
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))
```

**Des spies mémoïsés, sous une forme unique par projet.** Une factory `vi.mock`
est ré-exécutée pour chaque fichier de test : un `vi.fn()` inline y serait
recréé à chaque fichier, laissant les importeurs figés sur une instance
précédente. Les spies partagés vivent donc dans des modules réguliers évalués
une fois par worker (`*.spies.ts` de `@pulse/common/mocks/vitest`, cache de
`spyWrappedModule`) et la factory ne fait que les référencer. `spyWrappedModule`
mémoïse par **identité du module réel** (une `WeakMap`, stable par worker) :
aucune clé de cache à écrire ni à garder unique — passez-le tel quel comme
factory : `vi.mock('./x', (importOriginal) => spyWrappedModule(importOriginal))`.

Trois corollaires de cette instance unique et partagée :

- **Une seule forme de mock par module.** Deux specs d'un même projet ne
  doivent jamais mocker le même module avec des formes différentes (factory
  partielle vs automock nu) : dans un worker partagé, une forme peut gagner sur
  l'autre et faire manquer des exports. La forme unique vit dans le
  `vitest.setup.ts` (spy-wrap), les specs ne font qu'armer des comportements.
- **Jamais de factory locale d'un module hubbé.** Un `vi.mock` local dans une
  spec sur un module déjà hubbé ne survit pas au partage du registre (les
  importeurs déjà évalués restent figés sur l'instance du hub) : au mieux
  redondant, au pire trompeur. Cas particulier de la règle générale : les specs
  ne déclarent jamais de `vi.mock` — pour mocker un nouveau module, ajouter un
  one-liner spy-wrap au `vitest.setup.ts` du projet.
- **Jamais de `vi.spyOn` sur l'objet-module d'une factory hub.** La factory
  `{ ...actual }` est ré-évaluée par fichier : un `vi.spyOn(moduleObject, 'fn')`
  ne patche que l'instance du fichier courant. Spy-wrapper l'export dans le hub
  et stubber l'instance partagée via `vi.mocked(fn)`.

```ts
// ❌ ne patche que l'instance du fichier courant
vi.spyOn(toolboxModule, 'formatDate').mockReturnValue('…')
// ✅ l'export est spy-wrappé dans le hub ; on stubbe l'instance partagée
vi.mocked(formatDate).mockReturnValue('…')
```

### `guardrails` — Les garde-fous tournent avant chaque test ; pinia & environnement par fichier

L'hygiène des mocks est assurée par `mockReset: true` dans la config de base
(`packages/@config/vite.config.base.ts`) : avant chaque test, les files
`mockXxxOnce` non consommées sont vidées et chaque `vi.fn(impl)` retrouve son
implémentation d'origine — les modules spy-wrapped redeviennent donc réels
d'eux-mêmes. `setupIsolateSafeGuards()`
(`packages/@config/vitest.setup.base.ts`), appelé par le setup de **chaque
projet**, complète avant chaque test avec : timers réels rétablis, démontage
automatique des wrappers (`shared-dom`), activation de la testing pinia du fichier
courant (opt-out `{ withTestingPinia: false }`) et, pour les projets qui
spy-wrappent `useI18n`, le défaut identité `t` (opt-in `{ stubI18nIdentity:
true }`, voir `contested-modules`).

Conséquence directe : le `mockReset` passant **avant** les hooks, tout
`mockReturnValue` posé au niveau module (ou dans un `beforeAll`) est effacé
avant le premier test. Armer les comportements dans un `beforeEach` (ou dans le
test lui-même), jamais au niveau module.

**Pinia et environnement : un fixture par fichier.** Une testing pinia **par
fichier**, activée automatiquement par les garde-fous ; `getStoreMock` est un
proxy paresseux qui résout le store contre la pinia du fichier en cours (un
`const mock = getStoreMock(...)` au niveau module reste valide). L'état d'un
store persiste entre les tests d'un même fichier : chaque test écrit ce qu'il
lit. Côté environnement, `env-vars` résout vers le fixture canonique
(`envVarsMock`) via le hub, et `unstubEnvs`/`unstubGlobals` restaurent après
chaque test ce qui a été posé via `vi.stubEnv`/`vi.stubGlobal`.

### `contested-modules` — spy-wrappés réels par défaut, id-split, flush de l'own-spec

Un module « contesté » (testé en réel par sa propre spec, stubbé par ses
consommateurs) est enveloppé une seule fois par worker via `spyWrappedModule`
(`@pulse/toolbox/mocks/spy-module.helper`) : chaque export fonction
devient un `vi.fn(realImpl)`. Réel par défaut, ré-armé avant chaque test par le
`mockReset` global (`guardrails`), stubbé par test via `vi.mocked(...)` — les specs
legacy ré-appliquent leurs comportements d'automock avec `armModuleMocks`. Quand
l'own-spec doit échapper au hub, on mocke l'id du **barrel** et la spec importe
le **fichier concret** (id-split : `@pulse/common/api` hubbé, `./api` réel dans
`api.spec.ts`).

```ts
// api.spec.ts — l'own-spec teste le réel
vi.mock('@pulse/common/api', () => apiHubMock()) // le barrel reste hubbé pour les consommateurs
import { fetchThing } from './api'                //  …mais la spec importe le fichier concret
```

**Flusher l'async de l'own-spec.** Quand l'own-spec d'un module spy-wrappé
tourne pendant que des consommateurs l'arment, les validations détachées
(element-plus, promesses tardives) doivent être flushées **pendant que les stubs
sont encore armés** : `afterEach(async () => { await flushPromises() })`, sinon
elles se résolvent pendant le reset du test suivant et rejettent unhandled.

> **Cas particulier — `useI18n` (vue-i18n).** `useI18n` est spy-wrappé comme un
> module contesté, mais **à l'inverse du défaut « réel »** des autres exports
> spy-wrappés : `setupIsolateSafeGuards({ stubI18nIdentity: true })` lui pose
> worker-wide, avant chaque test, un défaut `stubUseI18nWithIdentityT()` — un
> mock identité `{ t, d, n }` où `t` renvoie la clé brute et où les formateurs
> `d`/`n` stringifient leur valeur (`String(value)`) — comme le vrai composer,
> dont les formateurs renvoient toujours une chaîne (un passe-plat brut
> passerait un `Date`/`number` à des props typées `String`, rejeté au mount).
> Raison de fond : vue-i18n est
> **tiers** (pas d'own-spec réelle à préserver via id-split, contrairement à un
> module maison), et les specs de **booking**, **entities** et
> **offers-catalog** **ne doivent pas tester le wording ni le formatage** —
> elles assertent la clé i18n, pas la traduction rendue.
>
> **Poser ce défaut sur un projet a un coût.** Les specs qui **montent des
> composants** consommant `useI18n` doivent être adaptées : (1) le mock fournit
> `d`/`n` qui stringifient leur valeur pour que le rendu de dates/nombres ne casse pas, mais (2)
> toute assertion sur un **libellé traduit** ou une **date/un nombre formaté**
> doit être remplacée par la **clé** i18n (pour `t`) ou une assertion insensible
> au formatage (`expect.any(String)` pour une date, spy de l'appel `t` pour un
> compte interpolé). C'est ce qui a été fait pour `entities`. Avant de
> généraliser à un nouveau projet, prévoir cette passe sur ses specs de
> composants.

### `static-classes` — `vi.spyOn` par test, pas de module mock

Les services/managers en classe statique (managers `@pulse/common`,
`LogoutService`, `CurrentUserService`…) appellent leurs méthodes via
l'identifiant de classe : un module mock ne les intercepterait pas
correctement. Les consommateurs les stubbent avec un
`vi.spyOn(Classe, 'methode')` **par test** (restauré par `restoreMocks`).

```ts
// dans un consommateur de LogoutService
beforeEach(() => {
  vi.spyOn(LogoutService, 'logout').mockResolvedValue() // restauré automatiquement
})
```

### `shared-dom` — DOM & montage partagés : ne rien écraser, tout démonter

Le document jsdom, `window` et les globals sont partagés par tout le worker.

- **Ne jamais écraser l'état partagé.** Ne pas réaffecter `window.location`, ne
  pas vider `document.body` : d'autres fichiers s'appuient dessus. Ne retirer que
  les nœuds que la spec a ajoutés, stubber via `vi.stubGlobal` (restauré
  automatiquement), et remettre en place dans un `afterEach` tout état module
  qu'une spec a dû modifier.
- **Pas d'arbres zombies.** Un wrapper resté monté continue de patcher le
  document partagé pendant les fichiers suivants (drawers element-plus
  téléportés…). Les garde-fous arment `enableAutoUnmount(afterEach)` pour tout
  le projet.
- **Jamais de `mount` au niveau module.** Un montage top-level s'exécute à
  l'import du fichier, **avant** le `beforeEach` des garde-fous : il capture les
  stubs du fichier précédent. Toujours `let wrapper` + montage dans un
  `beforeEach`/dans le test.

```ts
// ❌ capture les stubs du fichier précédent
const wrapper = mount(MyComponent)
// ✅
let wrapper: VueWrapper
beforeEach(() => { wrapper = mount(MyComponent) })
```

### `async-registry` — one-shots consommés, mocks résolus après un reset

Le `mockReset` global vide les files `mockXxxOnce` avant chaque test : un
one-shot ne peut donc pas fuir d'un test à l'autre. Un `Once` consommé par le
test lui-même (stub simple, chaîne de pagination) est acceptable ; préférer
malgré tout un stub persistant (`mockResolvedValue`) accompagné d'assertions de
nombre d'appels quand l'unicité fait partie du contrat. Ne jamais compter sur un
`Once` posé par un test pour un test suivant, et attendre l'async tardif
(`vi.waitFor`, `flushPromises`) plutôt que de compter sur l'ordre.

`vi.resetModules()` évince du registre partagé les modules de mocks eux-mêmes
(`@pulse/toolbox/mocks`…) : la prochaine exécution d'une factory hub les
ré-évalue et câble le SUT fraîchement importé sur de **nouvelles instances**. Un
spy importé au niveau module de la spec pointe alors sur l'ancienne génération et
n'enregistre plus rien (vécu : le `loggerMock` de
`AccountingHubConnection.spec.ts`, vert en solo car la factory toolbox est déjà
en cache avant le premier reset, rouge en worker partagé). Dans une spec qui
reset le registre, résoudre les mocks par un `await import(...)` **après** le
reset, dans la même génération que le SUT ; seuls les spies capturés par closure
(`vi.hoisted`) restent stables à travers un reset.

```ts
it('logs on connect', async () => {
  vi.resetModules()
  const { logger } = await import('@pulse/toolbox/mocks')          // même génération…
  const { AccountingHubConnection } = await import('./accounting-hub-connection') // …que le SUT
  // … logger enregistre bien les appels
})
```

### `mock-barrel` — les modules du barrel de mocks n'importent pas de code applicatif

`@pulse/common/mocks/vitest` (le barrel) est chargé **depuis l'intérieur des
factories `vi.mock`** (p. ex. la factory styleguide de ged importe
`useResponsiveMock`). Un fichier ré-exporté par ce barrel qui value-importe du
code applicatif au niveau module peut atteindre un id mocké dont la factory est
justement en attente — deadlock immédiat du worker (vécu : les spies de
`CurrentEntityManager` important le barrel des managers, qui atteint
`@pulse/styleguide` via le store invoices-access). Dans ces fichiers : imports
applicatifs **paresseux** (`await import(...)` dans la fonction du helper), seuls
les imports de types et de modules de test restent au niveau module.

## Outillage — le lint fait respecter les lois

Depuis le chantier de verrouillage, les lois mécanisables ne reposent plus sur
la revue :

- **ESLint** (`eslint.config.mjs`, bloc `**/*.spec.ts`) : `vi.mock` interdit
  dans les specs (dérogations nominatives par `eslint-disable` + `doctrine:`),
  armement de mocks et `mount` interdits au niveau module/describe
  (`vitest/require-hook` + selectors), assignations directes de
  globals/`document.body` interdites (`shared-dom`), value-imports applicatifs
  interdits dans les barrels de mocks (`mock-barrel`).
- **Vérification shuffle (manuelle)** : toute dépendance d'ordre résiduelle se
  détecte en relançant une suite avec l'ordre des fichiers mélangé et le seed
  loggé, via `npx vitest run --sequence.shuffle.files --sequence.seed=<seed>`
  (à reproduire localement — il n'y a plus de run nightly dédié).

## Retrouver l'isolation pour un projet

`isolate: false` vient de la config de base. Un projet qui a besoin de revenir
en arrière peut surcharger `isolate: true` dans son `vitest.config.ts`.

## Fichiers de référence

| Rôle | Fichier |
|------|---------|
| Config de base (`isolate: false`, `mockReset`) | `packages/@config/vite.config.base.ts` |
| Hubs universels (setup file commun) | `packages/@config/vitest.setup.hubs.ts` |
| Garde-fous par test (timers, auto-unmount, pinia, i18n) | `packages/@config/vitest.setup.base.ts` (`setupIsolateSafeGuards`) |
| Factories des hub mocks | `packages/@config/vitest.hub-mocks.ts` |
| Spy-wrap mémoïsé (total ou partiel) + `armModuleMocks` | `packages/libraries/toolbox/src/__mocks__/spy-module.helper.ts` (`@pulse/toolbox/mocks/spy-module.helper`) |
| Spies & mocks partagés | `packages/libraries/common/src/__mocks__/vitest/` |
| Testing pinia par fichier | `packages/libraries/common/src/__mocks__/vitest/store.spies.ts` |
