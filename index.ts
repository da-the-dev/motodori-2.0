// Libraries
import { Client, Collection } from 'discord.js'
import { config } from 'dotenv'; config()
import { BaseCommand } from './headers/interfaces'
import { Connection, RedCon } from './headers/classes'
import { simStr, walk, setupServer, logger, redisHandler } from './headers/utility'
import { cachedServers, updateCache } from './headers/globals'
import { createPrivateRoom, deletePrivateRoom } from './utility/privateRooms'


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
process.on('SIGINT', async () => {
    logger.mark('Bot process terminated')
    await Connection.closeAll()
    process.exit(0)
})
async function exitHandler() {
    logger.mark('Bot process restarted via nodemon')
    await Connection.closeAll()
    process.exit(0)
}
process.on('SIGUSR1', exitHandler.bind(null, null))
process.on('SIGUSR2', exitHandler.bind(null, null))

// Client setup
const prefix = '!'
const client = new Client({ partials: ['CHANNEL', 'MESSAGE', 'REACTION'] })
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('discord-buttons')(client)
const commands: Collection<string, BaseCommand> = new Collection()
walk('./commands').filter(cn => cn.endsWith('.ts')).forEach(async (cn: string) => {
    cn = cn.slice(0, -3)
    const command: BaseCommand = await import(`${cn}`)
    cn = cn.split('/').pop()
    logger.debug(`{F} ${cn}, ${command}`)
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
    // new RedCon()
    // new RedCon()
    new RedCon()
    logger.info('Bot started')
    redisHandler(client)
})
// Once the bot is added on another server
client.on('guildCreate', async guild => {
    logger.info(`Bot was invited to a new guild "${guild.name}"`)
    await setupServer(guild)
})
client.on('voiceStateUpdate', async (oldState, newState) => {
    await createPrivateRoom(oldState, newState)
    await deletePrivateRoom(oldState, newState)
})
// Once the bot recieves a message
client.on('message', async msg => {
    // if (msg.author.id === '315339158912761856' && msg.content.startsWith(prefix) && !msg.author.bot) {
    if (msg.content.startsWith(prefix) && !msg.author.bot) {
        // logger.debug('here')

        const args = msg.content.slice(1).split(' ').map(e => e.trim())
        const command = args.shift().split('\n')[0]

        // Try to execute a command and suggest closest one if none found
        try {
            const execCommand = commands.get(command)
            if (!execCommand) throw new Error('No command found')

            if (!cachedServers.has(msg.guild.id))
                await updateCache(msg.guild.id)

            const flags = cachedServers.get(msg.guild.id).data.flags
            logger.debug(flags, execCommand.flag, flags.includes(execCommand.flag))

            // If the server has the flag need for the command execution
            if (args[0] === 'help')
                execCommand.help(msg)
            else
                await execCommand.foo(msg, args, client)
            // if (flags.includes(execCommand.flag) || command === 'resetPerms')
            //     if (args[0] === 'help')
            //         execCommand.help(msg)
            //     else
            //         await execCommand.foo(msg, args, client)
            // else
            //     msg.reply('На этом сервере недоступна эта команда!')
        } catch (err) {
            if (err.message === 'No command found') {
                let closeCommand: string
                let max = 0
                for (const cn of commands.keys())
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



