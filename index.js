const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const minimist = require('minimist')

module.exports = function dockerBin (dirname, opts = {}) {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['sudo', 'persistent', 'cwd', 'home', 'privileged'],
    string: ['device']
  })

  const {
    sudo = false,
    persistent = false,
    cwd = false,
    home = false,
    privileged = false,
    device = null
  } = { ...opts, ...argv }

  const pkg = require(path.join(dirname, 'package.json'))
  const tag = pkg.name + ':npm-' + pkg.version

  try {
    const once = !exec('docker', ['images', tag, '-q', '--no-trunc'], { sudo }).length

    if (once) {
      exec('docker', ['build', '--progress=plain', '--tag=' + tag, dirname], { sudo, stdio: 'inherit' })
    }

    const imageId = exec('docker', ['build', '--tag=' + tag, '-q', dirname], { sudo }).toString().trim()

    exec('docker', [
      'run',
      persistent ? null : '--rm',
      '-ti',
      cwd ? ('-v=' + path.resolve('.') + ':/mnt/cwd') : null,
      home ? ('-v=' + os.homedir() + ':/mnt/home') : null,
      privileged ? '--privileged' : null,
      device ? ('--device=' + device) : null,
      imageId
    ], { sudo, stdio: 'inherit' })
  } catch (err) {
    process.exitCode = err.status || 1
  }
}

function exec (cmd, args, opts = {}) {
  const {
    sudo = false,
    stdio = null
  } = opts

  if (sudo) {
    args.unshift(cmd)
    cmd = 'sudo'
  }

  return execFileSync(cmd, args.filter(v => v), { stdio })
}
