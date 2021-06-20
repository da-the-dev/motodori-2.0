# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][Keep a Changelog] and this project adheres to [Semantic Versioning][Semantic Versioning].

## [Latest]
---
## [0.1.0] - 2021-06-20
### Added
  - Addded `DBInterfaces.ts` with all database-related interfaces.
  - Added `DB.ts` with `Connection` and `DBUser` class. They are used to easily communicate with Mongo database.
  - Added `.bal` command in `bal.ts`, which shows member's balance.
  - Added `.transfer` command in `transfer.ts`, which allows members to transfer money between each other.
  - Added periods at the end of sentences in `changelog.md`.
### Changed
  - Changed target in `tsconfig.json` from `ES5` to `ES6`.
  - Changed pinging in `embed.ts` to make first content's letter lowercase.
### Fixed
  - Fixed `/interface` folder name from `/inteface`.
  - Fixed imports in `av.ts` and `info.ts`.

### Removed
  - Removed `as MessageEmbed` from `av.ts` and `info.ts` in `help` function.
---
## [0.0.3] - 2021-06-15

### Added
  - Added *"esModuleInterop"* to `tsconfig.json` in order to help with imports.
  - Added a mandatory *"help"* function to `BaseCommand.ts` interface to be used when user needs additional .help with a command.
  - Added help function support in `index.ts`.
  - Added `/utility/embed.ts` that brings a standard embed reply system.
  - Added `.av` command in `/commands/av.ts`.
  - Added `.info` command in `/commands/info.ts`.
  - Added and enabled Dependabot.

### Changed
 - Changed default prefix from `.` to `!` untill release.
 - Changed `ready` event log in `index.ts` to 'Bot started'.
 - Changed the way command suggestion works. If a simmular command wasn't found, no reply, reply with a .suggestion otherwise.

### Removed
  - Removed unused imports from `index.ts`.
---
## [0.0.2] - 15-06-2021

### Added
  - Added TypeScript support.
  - Added `start` script to `package.json`.
  - Added `log4js` as a logger dependency.
  - Added `logger.ts`, which exports the default logger.
  - Added `index.ts` with command scanning, command suggestions and error handling.
  - Added `BaseCommand.ts` as a command template.
  - Added `closestString.js`, which includes a command suggestion algorithm.
  - Added `test.ts` as a test command.
  - Added `/out` directory to `.gitignore` to exclude TypeScript compiled files.
### Changed
  - Changed `test` script to start `test.s` file via *nodemon*.
---
## [0.0.1] - 15-06-2021

### Added
  - Added `changelog.md`.
  - Added `LICENSE.md`.
  - Added `README.md`.
  - Added `.gitignore`.
  - Added `discord.js`, `dotenv` and `canvas` as new dependencies.


<!-- Links -->
[Keep a Changelog]: https://keepachangelog.com/
[Semantic Versioning]: https://semver.org/

<!-- Versions -->
[Latest]: https://github.com/da-the-dev/motodori-2.0/compare/0.1.0...HEAD
[0.1.0]: https://github.com/da-the-dev/motodori-2.0/compare/v0.0.3..v0.1.0
[0.0.3]: https://github.com/da-the-dev/motodori-2.0/compare/v0.0.2..v0.0.3
[0.0.2]: https://github.com/da-the-dev/motodori-2.0/compare/0.0.2...0.0.1
[0.0.1]: https://github.com/da-the-dev/motodori-2.0/releases/v0.0.1
