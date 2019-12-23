import * as core from '@actions/core'
import IdentifierInstaller from './IdentifierInstaller'
import {Inputs} from './constants'

async function run(): Promise<void> {
  const submodulePath = core.getInput(Inputs.SubmodulePath, {required: true})
  const identifier = core.getInput(Inputs.IdentifierFile, {required: false})
  const hasIdentifier = !!identifier

  const identifierInstaller = new IdentifierInstaller(submodulePath)
  {
    core.debug(new Date().toTimeString())

    if (hasIdentifier) {
      await identifierInstaller.uninstall()
    }

    core.debug(new Date().toTimeString())
  }
}

run().catch(e => core.setFailed(e.message))
