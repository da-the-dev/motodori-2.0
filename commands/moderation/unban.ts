import { DBUser } from '../../headers/classes'
import { cachedServers } from '../../headers/globals'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed, setRoleCheck } from '../../headers/utility'

const sMsg = 'Локальная блокировка'
/** @example Usage: `.unban @member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'admin'))
            return

        if (!setRoleCheck(msg, sMsg, msg.guild.id, 'banned'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'не указан участник!', true)
            return
        }

        const user = await new DBUser(msg.guild.id, mMember.id).fetch()
        user.data.ban = false
        await user.save()
        mMember.roles.remove(cachedServers.get(msg.guild.id).data.settings.roles.banned)

        embed(msg, sMsg, `C пользователя <@${mMember.id}> была снята локальная блокировка`)
        // utl.actionLogs.modLog(msg.guild, 'ban', msg.member, mMember, msg.createdTimestamp)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.unban @member - локально разбанить участника member\`
        \`Команда доступна всем с ролью "Администратор" и выше\`
        `)
    },
    description: 'Разбанить участника',
    flag: 'default'
}
export = command