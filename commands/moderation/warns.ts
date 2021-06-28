import { BaseCommand } from '../../headers/interfaces'
import { embed, roleCheck } from '../../headers/utility'
import { DBUser } from '../../headers/classes'
import { MessageEmbed } from 'discord.js'

const sMsg = 'История предупреждений'
/** @example Usage: `.warns @member?` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const mMember = msg.mentions.members.first()
        const emb = embed(msg, `${sMsg} • ${msg.member.displayName}`, '', false, false) as MessageEmbed
        if (!mMember) {
            const user = await new DBUser(msg.guild.id, msg.author.id).fetch()
            if (!user.data.warns) {
                embed(msg, sMsg, `У Вас нет предупреждений`)
                return
            }

            for (let i = 0; i < user.data.warns.length; i++) {
                const w = user.data.warns[i]
                const date = new Date(w.time).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
                emb.addField('Дата выдачи', `**${i + 1}.** — ${date}`, true)
                emb.addField(`Исполнитель`, `<@${w.who}>`, true)
                emb.addField(`Причина`, `${w.reason}`, true)
            }
            msg.channel.send(emb)
        } else {
            if (!roleCheck(msg, sMsg, 'voiceMod'))
                return
            const user = await new DBUser(msg.guild.id, mMember.id).fetch()
            if (!user.data.warns) {
                embed(msg, sMsg, `У ${mMember} нет предупреждений`)
                return
            }

            for (let i = 0; i < user.data.warns.length; i++) {
                const w = user.data.warns[i]
                const date = new Date(w.time).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
                emb.addField('Дата выдачи', `**${i + 1}.** — ${date}`, true)
                emb.addField(`Исполнитель`, `<@${w.who}>`, true)
                emb.addField(`Причина`, `${w.reason}`, true)
            }
            msg.channel.send(emb)
        }
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.warns - выводит Ваши варны\`
        \`.warns @member- выводит варны пользователя member *(доступно только модераторам)*\`
        `)
    },
    description: 'Показывает варны участника',
    flag: 'default'
}
export = command


module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .warns <?member>
    */
    async (args, msg, client) => {

    }