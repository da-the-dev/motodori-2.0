import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'
import { DBUser } from '../../headers/classes'

const sMsg = 'Баланс'
/** @example Usage: `.bal @member?` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const mMember = msg.mentions.members.first() || msg.member
        embed(msg, sMsg, `У <@${mMember.id}> на балансе **${(await new DBUser(mMember.guild.id, mMember.id).fetch()).data.money}**`)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.bal - выводит Ваш баланс\`
        \`.bal @Kanto - выводит Ваш баланс пользователя Kanto\`
        `)
    },
    description: 'Показывает баланс участника'
}
export = command
