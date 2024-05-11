# docker-bin

Run Dockerfile from a NPM package

```
npm i docker-bin
```

## Usage

```js
#!/usr/bin/env node

require('docker-bin')(__dirname, { cwd: true })
```

## API

#### `bin(dirname, [options])`

It uses `process.argv` as default options, unless you override them.

Available `options`

```js
{
  sudo = false, // Run Docker commands with sudo
  persistent = false, // Keep container after being stopped
  cwd = false, // Map the working directory into /mnt/cwd
  home = false, // Map the home directory into /mnt/home
  privileged = false, // Access to all devices, disables AppArmor/SELinux, etc
  device = null // Map a specific device like /dev/ttyUSB0
}
```

For example, enable home dir by `--home` or forcefully enable it via code.

## License

MIT
