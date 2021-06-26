import { BaseCommand } from '../../headers/interfaces'
import { embed, roleCheck } from '../../headers/utility'
import { DBUser } from '../../headers/classes'
import { cachedServers } from '../../headers/globals'

const sMsg = 'Выдача валюты'
/** @example Usage: `.give @member <amount>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'admin'))
            return

        const mMember = msg.mentions.members.first()

        if (!mMember) {
            embed(msg, sMsg, 'Не указан пользователь!', true); return
        }
        const amount = Number(args[1])
        if (!amount || Number.isNaN(amount) || !Number.isInteger(amount) || amount == 0) {
            embed(msg, sMsg, 'Неверная сумма для перевода!', true); return
        }
        const user = await new DBUser(msg.guild.id, mMember.id).fetch()
        user.data.money += amount
        await user.save()

        embed(msg, sMsg, `${amount > 0 ? `Выдал пользователю ` : `Забрал у пользователя `} ${mMember} **${Math.abs(amount)}**`)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.give @Kanto 100 - выдаст пользователю Kanto 100 валюты\`
        \`.give @Kanto -100 - заберет у пользователя Kanto 100 валюты\`
        `)
    },
    description: 'Выдает участнику валюту',
    flag: 'economy'
}
export = command
