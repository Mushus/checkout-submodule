import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as path from 'path'
import {Inputs, Env} from './constants'
import IdentifierInstaller from './IdentifierInstaller'

async function run(): Promise<void> {
  const workspace = process.env[Env.workspace] || '/'

  const basePath = core.getInput(Inputs.BasePath, {required: false})
  const submodulePath = core.getInput(Inputs.SubmodulePath, {required: true})
  const identifier = core.getInput(Inputs.IdentifierFile, {required: false})
  const hasIdentifier = !!identifier

  const absRepositoryPath = path.resolve(workspace, basePath)
  const absSubmodulePath = path.resolve(absRepositoryPath, submodulePath)
  const identifierInstaller = new IdentifierInstaller(absSubmodulePath)

  {
    core.debug(new Date().toTimeString())

    const gitPath = await io.which('git', true)
    const sshPath = await io.which('ssh', true)

    let identifyPath: string | undefined
    if (hasIdentifier) {
      identifyPath = await identifierInstaller.install(identifier)
      identifyPath = identifyPath.replace(/\\/g, '/')
    }

    await exec.exec(`"${gitPath}"`, [
      '-C',
      absRepositoryPath,
      ...(identifyPath
        ? [
            '-c',
            `core.sshCommand="${sshPath}" -o StrictHostKeyChecking=no -i ${identifyPath} -F /dev/null`
          ]
        : []),
      'submodule',
      'update',
      '--init',
      submodulePath
    ])

    if (hasIdentifier) {
      await exec.exec(`"${gitPath}"`, [
        '-C',
        absSubmodulePath,
        'config',
        '--local',
        'core.sshCommand',
        `${sshPath} -o StrictHostKeyChecking=no -i ${identifyPath} -F /dev/null`
      ])
    }

    core.debug(new Date().toTimeString())
  }
}

run().catch(e => core.setFailed(e.message))
