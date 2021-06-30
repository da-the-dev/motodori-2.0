import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed } from '../../headers/utility'

const sMsg = 'Селфи'
/** @example Usage: `.unselfie @member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'не указан участник!', true)
            return
        }
        mMember.roles.remove('836306274759999489')

        embed(msg, sMsg, `У пользователя <@${mMember.id}> была убрана роль "Селфи"`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.unselfie @member - забрать роль "Селфи" у пользователя member\`
        \`Команда доступна всем модераторам\`
        `)
    },
    description: 'Выдать роль "Селфи"',
    flag: 'motodori'
}
export = command