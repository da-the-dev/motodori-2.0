import { Message, TextChannel } from 'discord.js'
import { BaseCommand } from '../../headers/interfaces'
import { embed, roleCheck } from '../../headers/utility'

const sMsg = 'Удаление сообщений'
/** @example Usage: `.clear <amount>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const msgAmount = Number(args[0])
        if (!msgAmount) {
            embed(msg, sMsg, 'Не указано количество сообщений!', true)
            return
        }
        if (!Number.isInteger(msgAmount) && !Number.isFinite(msgAmount) && !Number.isNaN(msgAmount)) {
            embed(msg, sMsg, 'Указано неверное количество сообщений!', true)
            return
        }

        const hundreds = Math.floor(msgAmount / 100)
        const rest = msgAmount % 100

        for (let i = 0; i < hundreds; i++)
            (msg.channel as TextChannel).bulkDelete(100)

        rest > 0 ? await (msg.channel as TextChannel).bulkDelete(rest) : null;
        (embed(msg, sMsg, `Удалено **(${msgAmount})** сообщений`) as Promise<Message>)
            .then(m => m.delete({ timeout: 3000 }))
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.clear 10 - удалит 10 последних сообщений в чате\`
        `)
    },
    description: 'Удаляет сообщения из чата',
    flag: 'default'
}
export = command