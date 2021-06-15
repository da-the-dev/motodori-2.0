# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.0.2] - 15-06-2021

### Added
  - Added TypeScript support
  - Added `start` script to `package.json`
  - Added `log4js` as a logger dependency
  - Added `logger.ts`, which exports the default logger
  - Added `index.ts` with command scanning, command suggestions and error handling
  - Added `BaseCommand.ts` as a command template
  - Added `closestString.js`, which includes a command suggestion algorithm
  - Added `test.ts` as a test command
  - Added `/out` directory to `.gitignore` to exclude TypeScript compiled files
### Changed
  - Changed `test` script to start `test.js` file via *nodemon*
  
## [0.0.1] - 15-06-2021

### Added
  - Added `changelog.md`
  - Added `LICENSE.md`
  - Added `README.md`
  - Added `.gitignore`
  - Added `discord.js`, `dotenv` and `canvas` as new dependencies
