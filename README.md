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

The user can disable any forced option in the code like so `--cwd=false`.

## API

#### `bin(dirname, [options])`

Build and run the Dockerfile that is in `dirname`.

The name and version from `package.json` is used to tag the Docker image.

It uses `process.argv` to override the default options.

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

## License

MIT
