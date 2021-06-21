import { BaseCommand } from '../../headers/interfaces'
import { DBServer } from '../../headers/classes'
import { logger, embed, } from '../../headers/utility'

const sMsg = 'Удаление флага (INDEV)'
/** @example Usage: `.addFlag <flag>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (msg.author.id === '315339158912761856') {
            const server = await new DBServer(msg.guild.id).fetch()
            server.data.flags.splice(server.data.flags.findIndex(f => f == args[0]), 1)
            await server.save()
            logger.debug(server.data.flags)
            embed(msg, sMsg, `Удален флаг: ${args[0]}`)
        }
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.delFlag economy - удаляет флаг "Economy"\`
        *Команда доступна **только** разработчику*
        `)
    },
    description: 'Удаляет флаг прав сервера',
    flag: 'default'
}
export = command