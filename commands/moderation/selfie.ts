import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed } from '../../headers/utility'

const sMsg = 'Селфи'
/** @example Usage: `.selfie @member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'не указан участник!', true)
            return
        }
        mMember.roles.add('836306274759999489')

        embed(msg, sMsg, `Пользователю <@${mMember.id}> была выдана роль "Селфи"`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.selfie @member - выдать пользователю member роль "Селфи"\`
        \`Команда доступна всем модераторам\`
        `)
    },
    description: 'Выдать роль "Селфи"',
    flag: 'motodori'
}
export = command