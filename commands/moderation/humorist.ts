import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed } from '../../headers/utility'

const sMsg = 'Выдача Humorist'
/** @example Usage: `.humorist @member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'не указан участник!', true)
            return
        }

        embed(msg, sMsg, `Пользователю <@${mMember.id}> была выдана роль "Humorist"`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.Humorist @member - выдать пользователю member роль "Humorist"\`
        \`Команда доступна всем модераторам\`
        `)
    },
    description: 'Выдать роль "Humorist"',
    flag: 'default'
}
export = command