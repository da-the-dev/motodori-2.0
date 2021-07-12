import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'
import { MessageEmbed } from 'discord.js'
const sMsg = 'Эмбед-билдер'

/** @example Usage: `.say {json data}` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        // if(utl.roles.privilage(msg.member, msg.guild.roles.cache.get(constants.roles.curator))) {
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
            embed(msg, sMsg, 'Некорректные данные для эмбеда!', true)
            return
        }

        if (jsonData.plainText && Object.keys(jsonData).length == 1) {
            msg.channel.send(jsonData.plainText || 'Сообщение было пустым')
                .catch(err => {
                    msg.channel.send(err)
                })
        } else {
            const embed = new MessageEmbed(jsonData)
                .setThumbnail(jsonData.thumbnail)
                .setImage(jsonData.image)

            msg.channel.send({
                content: jsonData.plainText,
                embed: embed
            }).catch(err => {
                msg.channel.send(err)
            })
        }
        msg.delete()
        // if(jsonData.plainText) msg.channel.send(jsonData.plainText)
        // else msg.channel.send(embed)
        // } else {
        //     utl.embed.ping(msg, '.say', 'у Вас нет прав на эту команду!')
        // }
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