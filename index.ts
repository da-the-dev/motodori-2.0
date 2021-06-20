// Libraries
import { Client, Collection } from 'discord.js'
import { config } from 'dotenv'; config()
import { readdirSync } from 'fs'
import { getLogger } from "log4js";
import { BaseCommand } from './interfaces/BaseCommand'
import { Connection } from './classes/DB'
import simStr from './utility/closestString'

// Logger setup
const logger = getLogger('Kanto bot')
logger.level = "debug"
export default logger

// Handling errors
process.on('uncaughtException', (err: Error) => {
    logger.fatal(`${err.stack}`)
    Connection.closeAll()
    process.exit(1)
})
process.on('unhandledRejection', (err: Error) => {
    if (err.name === 'usererror')
        logger.warn(err.message)
    else
        logger.error(`${err.stack}`)
})
// And restarts
process.on('SIGINT', () => {
    logger.mark('Bot process terminated')
    Connection.closeAll()
    process.exit(0)
})
function exitHandler(options, exitCode) {
    if (options.cleanup) {
        logger.mark('Bot process restarted via nodemon')
        Connection.closeAll()
    }
    if (options.exit) process.exit();
}
process.on('SIGUSR1', exitHandler.bind(null, { exit: true, cleanup: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true, cleanup: true }));

// Client setup
const prefix = '!'
const client = new Client({ partials: ['CHANNEL', 'MESSAGE', 'REACTION'] })
const commands: Collection<string, BaseCommand> = new Collection()
readdirSync('./commands').filter(cn => cn.endsWith('.ts')).forEach(async cn => {
    cn = cn.slice(0, -3)
    const command: BaseCommand = await import(`./commands/${cn}`)
    commands.set(cn, command)
})
client.login(process.env.TOKEN)

// Once the bot starts
client.once('ready', async () => {
    await Promise.all([
        // new Connection().connect(),
        // new Connection().connect(),
        new Connection().connect()
    ])
    logger.info('Bot started')
})

// Once the bot recieves a message
client.on('message', msg => {
    if (msg.author.id === '315339158912761856' && msg.content.startsWith(prefix) && !msg.author.bot) {
        const args = msg.content.slice(1).split(' ').map(e => e.trim())
        const command = args.shift()

        // Try to execute a command and suggest closest one if none found
        try {
            const execCommand = commands.get(command)
            if (args[0] === 'help')
                execCommand.help(msg)
            else
                execCommand.foo(msg, args, client)
        } catch (err) {
            if (err instanceof TypeError) {
                let closeCommand: string
                let max = 0
                for (let cn of commands.keys())
                    if (max < Math.max(max, simStr(cn, command))) {
                        max = Math.max(max, simStr(cn, command))
                        closeCommand = cn
                    }

                if (closeCommand)
                    msg.channel.send(`Неверная команда! Возможно, Вы имели ввиду \`${closeCommand}\`?`)
            } else {
                logger.error(err)
            }
        }
    }
})



