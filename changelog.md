# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][Keep a Changelog] and this project adheres to [Semantic Versioning][Semantic Versioning].

## [Latest]
---
## [0.3.3] - 2021-06-28 ⏤ Moderation commands
### Added
- Added `.eslintrc.json` for ESLint support
- Added `jsconfing.json`
- Added `package.json` to `.gitignore` to not rase conflicts on other systems when downloading the repository
- Added *"Close"* button to all pages in `Menu.ts`
- Added packages `handy-redis` and `redis` to support redis
- Added `RedCon.ts` to support redis connections
- Added `RedisHandler` to handle redis expire events
- Added `settingsChecks.ts` which contains functions `setRoleCheck()` and `setChannelCheck` that check if a settings is set in the server's settings or not
- Added *"motodori"* flag to `BaseCommand.ts`'s `Flag` type that makes commands to be exclusive to **motodori** server. It is used in `toxic.ts`, `untoxic.ts`, `selfie.ts` and `unselfie.ts`
- Imported `time.js` from the old version
- Added moderation commands such as `ban.ts`, `unban.ts`, `warn.ts`, `unwarn.ts`, `warns.ts`, `clear.ts`, `mute.ts`, `unmute.ts`, `toxic.ts`, `untoxic.ts`, `selfie.ts` and `unselfie.ts`
- Added `br.ts` which is a sort of casino
- Added `roleCheck` to `give.ts`
- Added `timely.ts` for dayly rewards
- Added new settings roles `muted` and `banned` in `Settings.ts`
- Added 2 more buttons for settings roles `muted` and `banned` in `settings.ts`
- Updated headers and imports across many files

### Changed
- Changed a lot of stuff in many files to improve consistency and to satisfy ESLint
- Changed `Connection.ts` methods to not use asyncronous promises, instead it now uses `async/await`
- Changed `DBServer.ts` methods to not use asyncronous promises, instead it now uses `async/await`
- Changed `DBUser.ts` methods to not use asyncronous promises, instead it now uses `async/await`
- Changed `saveRoleToSettings()` and `saveChannelIDToSettings()` in `settings.ts` to throw and catch errors for easier menu managment
- Changed `User` and `Server` interfaces in `DBInterfaces.ts` to use required properties instead of optional
- Changed `roleCheck` in `roles.ts` to be more verbose

### Deprecated
- Depracated `clone()` in `Menu.ts` because it isn't used anymore
- Depricated `put.js`

---
## [0.3.2] - 2021-06-26

### Added
- Added `globals.ts`, which includs caches variable and `updateCache` function
- Added cache update in `addFlag.ts`
- Added cache update in `delFlag.ts`

### Fixed
- Fixed menu message deletion in `Menu.ts`
- Fixed `saveRoleToSettings` when the role ID is not found

---
## [0.3.1] - 2021-06-26

### Fixed
- Fixed one way button support in `Menu.ts`.
- Fixed init logic in `OneWay.ts`.
- Fixed toggle logic in `Toggle.ts`.
- Fixed changelog.

---
## [0.3.0] - 2021-06-26 ⏤ Menus and per-server settings

### Added
- Added `Menu.ts` with a menu class that is based of `discord-buttons`.
- Added `Page.ts`, which is used by `Menu.ts`.
- Added `DBServer.ts`, which is simmular to `DBUser.ts`.
- Added `Button.ts`, which is a button class used by `Page.ts` and `Menu.ts`.
- Added `OneWay.ts`, which is a variant of `Button.ts` that, well, works only once (one way).
- Added `Toggle.ts`, which is a variant of `Button.ts` that toggles between an **ON** and **OFF** states.
- Added `addFlag.ts`, which adds flags to the server.
- Added `delFlag.ts`, which removes flags from the server.
- Added `resetPerms.ts`, which resets flags to just `"default"`.
- Added `settings.ts`, which is a settings command.
- Added server flags support in `index.ts` command handler.
- Added `flag` field to `BaseCommand.ts`.
- Added flags to `av.ts`, `info.ts`, `bal.ts`, `transfer.ts`.
- Added `Server` interface to `DBInterfaces.ts`.
- Added `PersonalRoom` interface to `DBInterfaces.ts`.
- Added `Settings.ts` with an interface and `nullSettings` to be used in `DBServer.ts`.
- Added missing imports to headers.

### Changed
- Changed `serverSetup.ts` setup function to suite latest update.

### Deprecated
- Depecated `put.js`'s function.
- Deprecated `clearButtons` `sendEmbed` and `delete` in `Menu.ts`

### Removed
- Removed line 5 from `logger.ts`.

---
## [0.2.1] - 2021-06-20 ⏤ 0.2.0 Hotfix #1

### Changed
  - Moved commands in separate folders for better management.

---
## [0.2.0] - 2021-06-20 ⏤ Restructuring update

### Added
  - Added `Connection.ts` and `DBUser.ts` which contain classes from the removed `DB.ts`.
  - Added `/headers` which contains `classes.ts`, `interfaces.ts` and `utility.ts` which export modules from their respective folders.
  - Added `walk` method that allows to put commands in separate folders in `index.ts`.
### Changed
  - Disabled *esModuleInterop* in `tsconfig.json`.
### Removed
  - Removed `DB.ts` and moved classes from it into separate files.
### Fixed
  - Fixed imports in all files.
---
## [0.1.1] - 2021-06-20 ⏤ 0.1.0 Hotfix #1

### Fixed
  - Fixed an issue where members could transfer more currency than they have.
## [0.1.0] - 2021-06-20 ⏤ Database update
### Added
  - Addded `DBInterfaces.ts` with all database-related interfaces.
  - Added `DB.ts` with `Connection` and `DBUser` class. They are used to easily communicate with Mongo database.
  - Added `.bal` command in `bal.ts`, which shows member's balance.
  - Added `.transfer` command in `transfer.ts`, which allows members to transfer money between each other.
  - Added server setup message in `index.ts` and `/utility/serverSetup.ts`.
  - Added periods at the end of sentences in `changelog.md`.
### Changed
  - Changed target in `tsconfig.json` from `ES5` to `ES6`.
  - Changed pinging in `embed.ts` to make first content's letter lowercase.
### Removed
  - Removed `as MessageEmbed` from `av.ts` and `info.ts` in `help` function.
### Fixed
  - Fixed `/interface` folder name from `/inteface`.
  - Fixed imports in `av.ts` and `info.ts`.

---
## [0.0.3] - 2021-06-15 ⏤ First commands

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
## [0.0.2] - 15-06-2021 ⏤ First steps

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
## [0.0.1] - 15-06-2021 ⏤ First update

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
[Latest]: https://github.com/da-the-dev/motodori-2.0/compare/v0.3.3..HEAD
[0.3.3]: https://github.com/da-the-dev/motodori-2.0/compare/v0.3.2..v0.3.3
[0.3.2]: https://github.com/da-the-dev/motodori-2.0/compare/v0.3.1..v0.3.2
[0.3.1]: https://github.com/da-the-dev/motodori-2.0/compare/v0.3.0..v0.3.1
[0.3.0]: https://github.com/da-the-dev/motodori-2.0/compare/v0.2.1..v0.3.0
[0.2.1]: https://github.com/da-the-dev/motodori-2.0/compare/v0.2.0..v0.2.1
[0.2.0]: https://github.com/da-the-dev/motodori-2.0/compare/v0.1.1..v0.2.0
[0.1.1]: https://github.com/da-the-dev/motodori-2.0/compare/v0.1.0..v0.1.1
[0.1.0]: https://github.com/da-the-dev/motodori-2.0/compare/v0.0.3..v0.1.0
[0.0.3]: https://github.com/da-the-dev/motodori-2.0/compare/v0.0.2..v0.0.3
[0.0.2]: https://github.com/da-the-dev/motodori-2.0/compare/0.0.2...0.0.1
[0.0.1]: https://github.com/da-the-dev/motodori-2.0/releases/v0.0.1
