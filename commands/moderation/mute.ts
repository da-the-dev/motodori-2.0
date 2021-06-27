import { DBUser, RedCon } from '../../headers/classes'
import { cachedServers } from '../../headers/globals'
import { BaseCommand } from '../../headers/interfaces'
import { roleCheck, embed, setRoleCheck } from '../../headers/utility'
import { duration } from 'moment'

const sMsg = 'Мут'

/** @example Usage: `.mute member duration reason` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return
        if (!setRoleCheck(msg, sMsg, msg.guild.id, 'muted'))
            return

        try {
            const mMember = msg.mentions.members.first()
            if (!mMember) throw 'no member'
            args.shift()

            const regex = /\d+s|\d+m|\d+h|\d+d/

            let time = 0
            const timeArgs = args.filter(e => regex.test(e))
            const reason = args.filter(e => !regex.test(e)).join(' ')
            timeArgs.forEach(e => {
                if (/\d+s/g.test(e))
                    time += Number(e.slice(0, -1))
                else if (/\d+m/g.test(e))
                    time += Number(e.slice(0, -1)) * 60
                if (/\d+h/g.test(e))
                    time += Number(e.slice(0, -1)) * 60 * 60
                if (/\d+d/g.test(e))
                    time += Number(e.slice(0, -1)) * 60 * 60 * 24
            })

            if (time <= 0) throw 'invalid time'
            if (!reason) throw 'invalid reason'

            await RedCon.getConnection().client.set(`mute-${msg.guild.id}-${mMember.id}`, '')
            await RedCon.getConnection().client.expire(`mute-${msg.guild.id}-${mMember.id}`, time)
            const user = await new DBUser(mMember.guild.id, mMember.id).fetch()
            user.data.mute = true
            await user.save()
            mMember.roles.add(cachedServers.get(msg.guild.id).data.settings.roles.muted)

            const dur = duration(time, 'seconds')
            const mmD = dur.days()
            const mmH = dur.hours()
            const mmM = dur.minutes()
            const mmS = dur.seconds()

            let muteMsg = ''

            if (mmD) muteMsg += '**${mmD.toString()}**д '
            if (mmH) muteMsg += '**${mmH.toString()}**ч '
            if (mmM) muteMsg += '**${mmM.toString()}**м '
            if (mmS) muteMsg += '**${mmS.toString()}**с '

            muteMsg = muteMsg.trim()
            embed(msg, sMsg, `<@${mMember.user.id}> получил(-а) **мут** на ${muteMsg} \n\`\`\`Elm\nПричина: ${reason}\n\`\`\``)
            // actionLogs.modLog(client.guild, 'mute', msg.member, mMember, msg.createdTimestamp, reason, time)
        } catch (err) {
            switch (err) {
                case 'no member':
                    embed(msg, sMsg, 'не указан участник!', true)
                    break
                case 'invalid time':
                    embed(msg, sMsg, 'неверно указано время!', true)
                    break
                case 'invalid reason':
                    embed(msg, sMsg, 'неверно указана причина!', true)
                    break
            }
        }
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.mute @member 10s громкие звуки - замутить участника member на 10 секунд с причиной *"громкие звуки"*\`
        \`Команда доступна всем с ролью "Администратор" и выше\`
        `)
    },
    description: 'Замутить участника',
    flag: 'default'
}
export = command