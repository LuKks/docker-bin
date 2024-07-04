const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const minimist = require('minimist')

module.exports = function dockerBin (dirname, opts = {}) {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['sudo', 'persistent', 'cwd', 'home', 'privileged'],
    string: ['device', 'volume'],
    default: {
      sudo: opts.sudo,
      persistent: opts.persistent,
      cwd: opts.cwd,
      home: opts.home,
      volume: opts.volume,
      privileged: opts.privileged,
      device: opts.device
    }
  })

  const variadic = parseVariadic(process.argv.slice(2))

  const {
    sudo = false,
    persistent = false,
    cwd = false,
    home = false,
    volume = null,
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

    const args = ['run', '-ti']

    if (!persistent) args.push('--rm')

    if (cwd) args.push('-v=' + path.resolve('.') + ':/mnt/cwd')
    if (home) args.push('-v=' + os.homedir() + ':/mnt/home')
    if (volume) {
      const volumes = Array.isArray(volume) ? volume : [volume]

      for (const v of volumes) {
        args.push('-v=' + v)
      }
    }

    if (privileged) args.push('--privileged')
    if (device) args.push('--device=' + device)

    args.push(imageId)

    if (variadic) {
      args.push('-ic')
      args.push(variadic.join(' '))
    }

    exec('docker', args, { sudo, stdio: 'inherit' })
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

function parseVariadic (argv) {
  const index = argv.indexOf('--')

  if (index === -1) {
    return null
  }

  return argv.splice(index + 1)
}
