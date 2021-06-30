import { DBUser } from '../../headers/classes'
import { BaseCommand } from '../../headers/interfaces'
import { embed, timeCalculator } from '../../headers/utility'

const sMsg = 'Профиль'
/** @example Usage: `.p @member?` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        // Member to get the profile of
        let pMember = msg.member
        const mMember = msg.mentions.members.first()
        if (mMember)
            pMember = mMember

        const user = await new DBUser(msg.guild.id, pMember.id).fetch()

        const emb = embed(msg, `${sMsg} — ${pMember.user.tag}`, `> **状態 Status:**\n\`\`\`${user.data.status || 'Не установлен'}\`\`\``, false, false)
            .addFields([
                {
                    'name': '> Yen Balance:',
                    'value': `\`\`\`${user.data.money || 0}\`\`\``,
                    'inline': true
                },
                {
                    'name': '> Voice activity:',
                    'value': `\`\`\`${timeCalculator(user.data.voiceTime || 0).replace(/[**]/g, '')}\`\`\``,
                    'inline': true
                },

                {
                    'name': '> Chat activity:',
                    'value': `\`\`\`${user.data.msgs || 0}\`\`\``,
                    'inline': true
                }
            ])
            .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))

        msg.channel.send(emb)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.p - выводит Ваш профиль\`
        \`.p @member - выводит профиль пользователя member\`
        `)
    },
    description: 'Показывает профиль участника',
    flag: 'default'
}
export = command