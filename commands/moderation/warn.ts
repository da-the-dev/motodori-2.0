import { DBUser, RedCon } from '../../headers/classes'
import { cachedServers } from '../../headers/globals'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed, logger } from '../../headers/utility'
const sMsg = 'Локальная блокировка'

/** @example Usage: `.warn @member warn message` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return

        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'Не указан пользователь для варна!', true)
            return
        }

        args.shift()

        const reason = args.join(' ').trim()
        if (!reason) {
            embed(msg, sMsg, 'Не указана причина варна!', true)
            return
        }

        const user = await new DBUser(msg.guild.id, mMember.id).fetch()
        logger.debug(user.data.warns.length)
        logger.debug(user.data)

        if (user.data.warns && user.data.warns.length >= 2) {
            logger.debug('mutting...')
            await RedCon.getConnection().client.set(`mute-${msg.guild.id}-${mMember.id}`, '')
            await RedCon.getConnection().client.expire(`mute-${msg.guild.id}-${mMember.id}`, 3 * 24 * 60 * 60)
            const user = await new DBUser(mMember.guild.id, mMember.id).fetch()

            user.data.mute = true
            user.data.warns = []

            mMember.roles.add(cachedServers.get(msg.guild.id).data.settings.roles.muted)
        }

        user.data.warns.push({ 'reason': reason, 'who': msg.author.id, 'time': msg.createdTimestamp })
        logger.debug(user.data)
        user.save()

        embed(msg, sMsg, `Пользователю <@${mMember.user.id}> выдано предупреждение \n\`\`\`Elm\nПричина: ${reason}\n\`\`\``)
        // utl.actionLogs.modLog(client.guild, 'warn', msg.member, mMember, msg.createdTimestamp, reason)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.warn @member оскорбления - выдать варн пользователю member с содержанием *"оскорбления"*\`
        \`Команда доступна всем с ролью "Войс модератор" и выше\`
        `)
    },
    description: 'Выдать участнику варн',
    flag: 'default'
}
export = command