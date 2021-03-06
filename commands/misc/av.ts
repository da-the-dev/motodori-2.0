import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'

const sMsg = 'Просмотр аватара'
/** @example Usage: `.av @member` */
const command: BaseCommand = {
    foo: (msg, args, client) => {
        const mMember = msg.mentions.members.first() || msg.member
        const emb = embed(msg, sMsg, `<@${mMember.id}>`, false, false)
        emb
            .setThumbnail('')
            .setImage(mMember.user.displayAvatarURL({ dynamic: true }) + '?size=2048')

        msg.channel.send(emb)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.av - выводит Ваш аватар\`
        \`.av @Kanto - выводит Ваш аватар пользователя Kanto\`
        `)
    },
    description: 'Показывает аватар участника',
    flag: 'default'
}
export = command