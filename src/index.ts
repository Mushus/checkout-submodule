import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'

async function run(): Promise<void> {
  try {
	const gitPath = await io.which('git', true)

    const path = core.getInput('path')
    const identityFile = core.getInput('identityFile')
    core.debug(new Date().toTimeString())

	exec.exec(gitPath, )

    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
