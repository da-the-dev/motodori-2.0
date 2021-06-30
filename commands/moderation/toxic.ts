import { DBUser } from '../../headers/classes'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed } from '../../headers/utility'

const sMsg = 'Токсик'
/** @example Usage: `.toxic @member` */
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
        user.data.toxic = true
        await user.save()
        mMember.roles.add('836305579424481360')

        embed(msg, sMsg, `Пользователю <@${mMember.id}> была выдана роль "Токсик"`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.toxic @member - выдать пользователю member роль "Токсик"\`
        \`Команда доступна всем модераторам\`
        `)
    },
    description: 'Выдать роль "Токсик"',
    flag: 'motodori'
}
export = command