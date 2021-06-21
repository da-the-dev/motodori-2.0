import { BaseCommand } from '../../headers/interfaces'
import { DBServer } from '../../headers/classes'
import { logger, embed, } from '../../headers/utility'

const sMsg = 'Сброс права сервера'
/** @example Usage: `.resetPerms` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const server = await new DBServer(msg.guild.id).fetch()
        server.data.flags = ['default']
        await server.save()
        logger.debug(server.data.flags)
        embed(msg, 'Ресет прав сервера', 'Права сервера были востановленны!')
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.resetPerms - cбрасывает права сервера\`
        `)
    },
    description: 'Cбрасывает права сервера',
    flag: 'default'
}
export = command