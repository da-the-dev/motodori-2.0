import { DBUser, RedCon } from '../../headers/classes'
import { cachedServers } from '../../headers/globals'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed, roleSetRoleCheck } from '../../headers/utility'

const sMsg = 'Мут'

/** @example Usage: `.unmute member` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return
        if (!roleSetRoleCheck(msg, sMsg, msg.guild.id, 'muted'))
            return
        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'Вы не указали пользователя для мута!')
            return
        }

        await RedCon.getConnection().client.del(`mute-${mMember.id}`)

        const user = await new DBUser(mMember.guild.id, mMember.id).fetch()
        user.data.mute = false
        await user.save()

        mMember.roles.remove(cachedServers.get(msg.guild.id).data.settings.roles.muted)

        embed(msg, sMsg, `<@${mMember.user.id}> был(-а) размьючен(-а)`)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.ban @member - локально забанить участника member\`
        \`Команда доступна всем с ролью "Администратор" и выше\`
        `)
    },
    description: 'Замутить участника',
    flag: 'default'
}
export = command