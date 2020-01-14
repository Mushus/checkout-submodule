import * as io from '@actions/io'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import * as crypto from 'crypto'

export default class IdentifierInstaller {
  private filename: string

  /**
   * Create Installer.
   *
   * @param {string} submodulePath - Absolute submodule path.
   */
  constructor(submodulePath: string) {
    const hash = crypto.createHash('sha256')
    hash.update(submodulePath)
    this.filename = hash.digest('hex')
  }

  async install(body: string): Promise<string> {
    const filename = this.filename
    const sshPath = await this.createSshPath()
    const identifierPath = path.join(sshPath, filename)
    // NOTE: The file content of identifierFile is not recognized as the
    // correct format without the final newline.
    // It is easy to forget the final newline when using secrets.
    const identifierContent = body.endsWith('\n') ? body : `${body}\n`
    fs.writeFileSync(identifierPath, identifierContent, {
      mode: '600'
    })
    return identifierPath
  }

  async uninstall(): Promise<void> {
    const filename = this.filename
    const sshPath = await this.createSshPath()
    const identifierPath = path.join(sshPath, filename)
    await io.rmRF(identifierPath)
  }

  async createSshPath(): Promise<string> {
    const homeDir = os.homedir()
    const sshDir = path.join(homeDir, '.ssh')
    await io.mkdirP(sshDir)
    fs.chmodSync(sshDir, '700')
    return sshDir
  }
}
