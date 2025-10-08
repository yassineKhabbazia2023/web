import { execSync } from 'child_process'
import path from 'path'
import { writeFileSync } from 'fs'
import { logger } from '@pulse/toolbox'

const [scriptName, relativeOutputFilePath] = process.argv.slice(1)
logger.info(`execute ${scriptName}`)

function getCurrentShortCommitId() {
  const cmd = 'git rev-parse --short HEAD'
  const shortCommitId = execSync(cmd).toString().trim()

  return shortCommitId
}

function getCurrentBranchName() {
  const cmd = 'git rev-parse --abbrev-ref HEAD'
  const shortCommitId = execSync(cmd).toString().trim()

  return shortCommitId
}

function getVersionInfo(shortCommitId: string, branchName: string) {
  const versionInfo = {
    shortCommitId,
    branchName,
  }

  return versionInfo
}

function writeCurrentShortCommitId(relativeOutputFilePath: string, versionInfo: Record<string, string>) {
  const outputPath = path.join(__dirname, relativeOutputFilePath)

  const versionInfoStringified = JSON.stringify(versionInfo)

  writeFileSync(outputPath, `${versionInfoStringified}\n`, 'utf8')

  return outputPath
}

const shortCommitId = getCurrentShortCommitId()
const branchName = getCurrentBranchName()
const versionInfo = getVersionInfo(shortCommitId, branchName)
const outputPath = writeCurrentShortCommitId(relativeOutputFilePath, versionInfo)

logger.info(`✅ ${outputPath} written successfully`)
