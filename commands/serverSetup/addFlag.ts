import { BaseCommand, Flags } from '../../headers/interfaces'
import { DBServer } from '../../headers/classes'
import { logger, embed, } from '../../headers/utility'
import { updateCache } from '../../headers/globals'

const sMsg = 'Добавление флага (INDEV)'
/** @example Usage: `.addFlag <flag>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (msg.author.id === '315339158912761856') {
            const server = await new DBServer(msg.guild.id).fetch()
            server.data.flags.push(args[0] as Flags)
            await server.save()
            logger.debug(server.data.flags)
            embed(msg, sMsg, `Добавлен флаг: ${args[0]}`)
            await updateCache(msg.guild.id)
        }
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.addFlag economy - добавляет флаг "Economy"\`
        \`*Команда доступна только разработчику*\`
        `)
    },
    description: 'Добавляет флаг прав сервера',
    flag: 'default'
}
export = command