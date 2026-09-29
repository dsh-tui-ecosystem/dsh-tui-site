// Resolve the settings manifest (lib/settings.json, schema v1) that the /settings/ reference page renders,
// and write it to src/content/settings.generated.json (gitignored).
//
// Local and PR builds — source, first match wins:
//   1. DSH_TUI_SETTINGS_FIXTURE=1       → src/content/settings.fixture.json
//   2. DSH_TUI_SETTINGS_FILE=<path>      → a local settings.json (preview a dsh-TUI build before it ships)
//   3. DSH_TUI_VERSION=<x.y.z>           → that exact published npm tarball
//   4. package.json config.dshTuiVersion → that exact published npm tarball
//   5. otherwise                         → the fixture
//
// Production builds (DSH_TUI_SETTINGS_PRODUCTION=1, set by the deploy workflow) never use the fixture
// or a local file: DSH_TUI_VERSION → config.dshTuiVersion → the npm `latest` dist-tag resolved to an
// exact version. `latest` is the one record that dispatch deploys and later push deploys both read, so
// a push after a release deploy keeps the released data instead of drifting back.
//
// Whenever a version is used there is no fallback: a missing tarball, a missing lib/settings.json, a
// version mismatch, or an unknown schemaVersion fails the build, so a deploy never replaces the live
// site with wrong data. DSH_TUI_PACK_RETRIES=<n> retries `npm pack` on a not-yet-visible fresh
// publish (60 s apart).
import { execFile } from 'node:child_process'
import { appendFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const rootDir = process.cwd()
const PACKAGE = '@deepseek-harness-tui/dsh-tui'
const FIXTURE = path.join(rootDir, 'src/content/settings.fixture.json')
const OUTPUT = path.join(rootDir, 'src/content/settings.generated.json')
const KINDS = new Set(['boolean', 'select', 'text', 'number'])
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

class SyncError extends Error {}

function fail(message) {
  throw new SyncError(message)
}

function isText(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function isPair(value) {
  return value !== null && typeof value === 'object' && isText(value.en) && isText(value.zh)
}

/** Structural check of a schema v1 document. Returns a list of problems. */
function validate(document, expectedVersion) {
  if (document?.schemaVersion !== 1) {
    return [`unsupported schemaVersion ${JSON.stringify(document?.schemaVersion)} (this site renders schemaVersion 1)`]
  }
  const problems = []
  if (document.package !== PACKAGE) problems.push(`package is ${JSON.stringify(document.package)}, expected ${PACKAGE}`)
  if (!isText(document.packageVersion)) problems.push('packageVersion missing')
  if (expectedVersion && document.packageVersion !== expectedVersion) {
    problems.push(`packageVersion ${document.packageVersion} does not match the requested ${expectedVersion}`)
  }
  if (!isText(document.namespace)) problems.push('namespace missing')
  if (!Array.isArray(document.groups) || document.groups.length === 0) {
    problems.push('groups must be a non-empty array')
  } else {
    const groupIds = new Set()
    for (const [index, group] of document.groups.entries()) {
      if (!isText(group?.id)) problems.push(`groups[${index}]: id missing`)
      else if (groupIds.has(group.id)) problems.push(`groups[${index}]: duplicate id ${group.id}`)
      else groupIds.add(group.id)
      if (!isPair(group?.label)) problems.push(`groups[${index}]: label needs both en and zh`)
    }
  }
  if (!Array.isArray(document.settings) || document.settings.length === 0) {
    problems.push('settings must be a non-empty array')
    return problems
  }
  const seen = new Set()
  for (const [index, setting] of document.settings.entries()) {
    const where = isText(setting?.key) ? setting.key : `settings[${index}]`
    if (!isText(setting?.key)) problems.push(`${where}: key missing`)
    else if (seen.has(setting.key)) problems.push(`${where}: duplicate key`)
    else seen.add(setting.key)
    if (!KINDS.has(setting?.kind)) problems.push(`${where}: unknown kind ${JSON.stringify(setting?.kind)}`)
    if (!isText(setting?.group)) problems.push(`${where}: group missing`)
    if (!isPair(setting?.label)) problems.push(`${where}: label needs both en and zh`)
    if (!isPair(setting?.description)) problems.push(`${where}: description needs both en and zh`)
    if (!('default' in (setting ?? {}))) problems.push(`${where}: default missing (use null for runtime-computed)`)
    if (setting?.options !== undefined) {
      if (!Array.isArray(setting.options)) problems.push(`${where}: options must be an array`)
      else for (const option of setting.options) {
        if (typeof option?.value !== 'string' || !isPair(option?.label)) problems.push(`${where}: option ${JSON.stringify(option?.value)} needs a string value and en/zh labels`)
      }
    }
    if (typeof setting?.restartRequired !== 'boolean') problems.push(`${where}: restartRequired must be boolean`)
    if (typeof setting?.deprecated !== 'boolean') problems.push(`${where}: deprecated must be boolean`)
  }
  return problems
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    fail(`cannot read ${path.relative(rootDir, file) || file}: ${error.message}`)
  }
}

async function packWithRetry(version, destination) {
  const retries = Math.max(0, Number.parseInt(process.env.DSH_TUI_PACK_RETRIES ?? '0', 10) || 0)
  for (let attempt = 0; ; attempt += 1) {
    try {
      const { stdout } = await run('npm', ['pack', `${PACKAGE}@${version}`, '--pack-destination', destination, '--json', '--silent'], {
        cwd: destination,
        maxBuffer: 16 * 1024 * 1024,
      })
      const [info] = JSON.parse(stdout)
      return path.join(destination, info.filename)
    } catch (error) {
      const output = `${error.stderr ?? ''}${error.stdout ?? ''}${error.message ?? ''}`
      const notYetVisible = /E404|ETARGET|No matching version/i.test(output)
      if (!notYetVisible || attempt >= retries) {
        fail(`npm pack ${PACKAGE}@${version} failed:\n${output.trim()}`)
      }
      console.log(`sync-settings: ${PACKAGE}@${version} not visible on the registry yet; retry ${attempt + 1}/${retries} in 60 s`)
      await new Promise((resolve) => setTimeout(resolve, 60_000))
    }
  }
}

/** The exact version the npm `latest` dist-tag points at right now. */
async function resolveLatest() {
  try {
    const { stdout } = await run('npm', ['view', `${PACKAGE}@latest`, 'version', '--json'])
    const version = JSON.parse(stdout)
    if (typeof version !== 'string') throw new Error(`unexpected npm view output: ${stdout.trim()}`)
    return version
  } catch (error) {
    fail(`cannot resolve ${PACKAGE}@latest to an exact version: ${error.message}`)
  }
}

async function fromNpm(version) {
  if (!VERSION_PATTERN.test(version)) {
    fail(`"${version}" is not an exact version (x.y.z[-pre]); dist-tags such as latest are not accepted`)
  }
  const workDir = await mkdtemp(path.join(tmpdir(), 'dsh-tui-settings-'))
  try {
    const tarball = await packWithRetry(version, workDir)
    try {
      await run('tar', ['-xzf', tarball, '-C', workDir, 'package/lib/settings.json'])
    } catch {
      fail(`${PACKAGE}@${version} does not ship lib/settings.json (releases before the settings manifest cannot feed this page)`)
    }
    return await readJson(path.join(workDir, 'package/lib/settings.json'))
  } finally {
    await rm(workDir, { recursive: true, force: true })
  }
}

try {
  const pkg = await readJson(path.join(rootDir, 'package.json'))
  const pinned = typeof pkg.config?.dshTuiVersion === 'string' ? pkg.config.dshTuiVersion.trim() : ''
  const envVersion = process.env.DSH_TUI_VERSION?.trim() ?? ''
  const forceFixture = ['1', 'true', 'yes'].includes((process.env.DSH_TUI_SETTINGS_FIXTURE ?? '').trim().toLowerCase())
  const localFile = process.env.DSH_TUI_SETTINGS_FILE?.trim() ?? ''
  const production = ['1', 'true', 'yes'].includes((process.env.DSH_TUI_SETTINGS_PRODUCTION ?? '').trim().toLowerCase())

  let source
  let requestedVersion = null
  let document
  if (production) {
    if (forceFixture || localFile) fail('production builds render published data only; unset DSH_TUI_SETTINGS_FIXTURE / DSH_TUI_SETTINGS_FILE')
    source = 'npm'
    requestedVersion = envVersion || pinned || await resolveLatest()
    console.log(`sync-settings: production build uses ${PACKAGE}@${requestedVersion} (${envVersion ? 'DSH_TUI_VERSION' : pinned ? 'config.dshTuiVersion' : 'npm latest'})`)
    document = await fromNpm(requestedVersion)
  } else if (forceFixture) {
    source = 'fixture'
    document = await readJson(FIXTURE)
  } else if (localFile) {
    source = 'file'
    document = await readJson(path.resolve(rootDir, localFile))
  } else if (envVersion || pinned) {
    source = 'npm'
    requestedVersion = envVersion || pinned
    document = await fromNpm(requestedVersion)
  } else {
    source = 'fixture'
    document = await readJson(FIXTURE)
  }

  const problems = validate(document, requestedVersion)
  if (problems.length > 0) {
    fail(`settings.json from ${source}${requestedVersion ? ` (${PACKAGE}@${requestedVersion})` : ''} is invalid:\n  ${problems.join('\n  ')}`)
  }

  await writeFile(OUTPUT, `${JSON.stringify({ source, document }, null, 2)}\n`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `Settings reference built from \`${source === 'npm' ? `${PACKAGE}@${document.packageVersion}` : source}\`\n`)
  }
  console.log(`sync-settings: ${document.settings.length} settings from ${source === 'npm' ? `${PACKAGE}@${document.packageVersion}` : source === 'file' ? localFile : 'the fixture'}`)
} catch (error) {
  if (!(error instanceof SyncError)) throw error
  console.error(`sync-settings: ${error.message}`)
  process.exit(1)
}
