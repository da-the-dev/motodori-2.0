import { BaseCommand } from '../../headers/interfaces'
import { embed, roleCheck } from '../../headers/utility'
import { DBUser } from '../../headers/classes'

const sMsg = 'Снятие предупреждений'
/** @example Usage: `.unwarn @member <index>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'voiceMod'))
            return
        const mMember = msg.mentions.members.first()

        if (!mMember) {
            embed(msg, sMsg, 'не указан пользователь!', true)
            return
        }
        if (!args[1]) {
            embed(msg, sMsg, 'не указан индекс варна!', true)
            return
        }
        if (!Number.isInteger(Number(args[1]))) {
            embed(msg, sMsg, 'указан неверный индекс варна!', true)
            return
        }

        const user = await new DBUser(msg.guild.id, mMember.id).fetch()
        const index = Number(args[1]) - 1

        if (!user.data.warns) {
            embed(msg, sMsg, `у пользователя <@${mMember.user.id}> нет предупреждений`, true)
            return
        }
        if (!user.data.warns[index]) {
            embed(msg, sMsg, `у пользователя <@${mMember.user.id}> нет такого предупреждения`, true)
            return
        }

        // const warn = user.data.warns[index].reason
        user.data.warns.splice(index, 1)
        await user.save()

        embed(msg, sMsg, `Предупреждения для пользователя <@${mMember.user.id}> обновлены!`)
        // utl.actionLogs.modLog(client.guild, 'unwarn', msg.member, mMember, msg.createdTimestamp, warn)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.unwarn @member 1 - уберет 1 по счету варн с пользователя member\`
        `)
    },
    description: 'Снимает варн с участника',
    flag: 'default'
}
export = command