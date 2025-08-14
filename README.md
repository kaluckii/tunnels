# tunnels

Typescript cli-utility for exposing tunnels on local machine via loophole, supports Windows and Linux.

## Commands

### `tunnels init`

Initializes configuration file.

### `tunnels run`

Runs specified in config tunnels via loophole in background mode.

### `tunnels status`

Shows active PM2 processes.

### `tunnels stop`

Removes all running tunnels from PM2.

## Configuration

Project uses a configuration file with:

- `tunnes` - array of runnel objects, each contains prefix (subdomain) and port to expose.
