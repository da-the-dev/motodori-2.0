import { MessageEmbed } from 'discord.js'
import { BaseCommand } from '../../headers/interfaces'
import { embed, roleCheck } from '../../headers/utility'
const sMsg = 'Эмбед-билдер'

/** @example Usage: `.edit {json data}` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (!roleCheck(msg, sMsg, 'admin'))
            return
        const messageID = args.shift()
        args.forEach(a => {
            if (a == '')
                a = '\n'
        })

        const stringData = ('{' + args.join(' ')).replace('{{', '{')

        let jsonData: Record<string, any> = {}
        if (stringData == '{') {
            embed(msg, sMsg, '\n[EmbedBuilder](https://embedbuilder.nadekobot.me/)\n\n\n\n')
            return
        }

        try {
            jsonData = JSON.parse(stringData)
        } catch (err) {
            embed(msg, sMsg, 'некорректные данные для эмбеда!', true)
            return
        }

        msg.channel.messages.fetch(messageID)
            .then(m => {
                if (m) {
                    if (jsonData.plainText && Object.keys(jsonData).length == 1) {
                        m.edit(jsonData.plainText)
                    } else {
                        const embed = new MessageEmbed(jsonData)
                            .setThumbnail(jsonData.thumbnail)
                            .setImage(jsonData.image)
                        m.edit({
                            content: jsonData.plainText,
                            embed: embed
                        })
                    }
                } else
                    embed(msg, sMsg, 'не найдено сообщение! Проверьте ID!', true)
            })
        msg.delete()
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.say - выводит ссылку на эмбед-билдер\`
        \`.say {json_данные_с_сайта} - отправляет эмбед\`
        `)
    },
    description: 'Показывает баланс участника',
    flag: 'default'
}
export = command