import { DBUser } from '../../headers/classes'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed } from '../../headers/utility'

const sMsg = 'Токсик'
/** @example Usage: `.untoxic @member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'не указан участник!', true)
            return
        }

        const user = await new DBUser(msg.guild.id, mMember.id).fetch()
        user.data.toxic = false
        await user.save()
        mMember.roles.remove('836305579424481360')

        embed(msg, sMsg, `C пользователя <@${mMember.id}> была убрана роль "Токсик"`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.untoxic @member - забрать роль "Токсик" у пользователя member\`
        \`Команда доступна всем модераторам\`
        `)
    },
    description: 'Выдать роль "Токсик"',
    flag: 'motodori'
}
export = command