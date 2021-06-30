import { Client } from 'discord.js'
import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'

/** Returns bot's uptime as a string */
function getTime(client: Client) {
    const date = new Date(client.uptime)
    const hours = (date.getHours() + date.getTimezoneOffset() / 60).toString()
    const minutes = date.getMinutes().toString()
    const seconds = date.getSeconds().toString()

    return hours.padStart(2, '0') + ':' + minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0')
}

const sMsg = 'Информация о боте'
/** @example Usage: `.info` */
const command: BaseCommand = {
    foo: (msg, args, client) => {
        const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024
        const emb = embed(msg, sMsg, null, false, false)
        emb
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addField('Автор бота', `\`\`\`${client.users.cache.find(u => u.id == process.env.MYID).tag}\`\`\``, true)
            .addField('Префикс', '```.```', true)
            .addField('Использование RAM', `\`\`\`${memoryUsed.toFixed(2)} MB\`\`\``, true)
            .addField('Язык Программирования', '```JavaScript```', true)
            .addField('Задержка', `\`\`\`${Math.floor(client.ws.ping)}\`\`\``, true)
            .addField('Время активности', `\`\`\`${getTime(client)}\`\`\``, true)

        msg.channel.send(emb)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.info - выводит информацию о боте\`
        `)
    },
    description: 'Показывает информацию о боте',
    flag: 'default'
}
export = command