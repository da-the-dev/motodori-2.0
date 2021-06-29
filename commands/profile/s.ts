import { DBUser } from '../../headers/classes'
import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'

const sMsg = 'Статус'
/** @example Usage: `.s <content?>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        if (args.length <= 0) {
            const user = await new DBUser(msg.guild.id, msg.author.id).fetch()
            user.data.status = ''
            await user.save()

            embed(msg, sMsg, `<@${msg.author.id}>, Ваш статус успешно удален`)
            return
        }
        const user = await new DBUser(msg.guild.id, msg.author.id).fetch()

        let state = args.join(' ')
        state = state.slice(0, state.length <= 60 ? state.length : 60)
        state = state.replace(/[\S]+(.com|.ru|.org|.net|.info)[\S]+/g, '')

        user.data.status = state
        await user.save()

        embed(msg, sMsg, `<@${msg.author.id}>, Ваш статус успешно установлен`)
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.s Статус - Установит Ваш статус как *"Статус"*\`
        \`.s - Удалит Ваш статус\`
        \`В статус запрещено вставлять любые ссылки\`
        `)
    },
    description: 'Устанавливает статус участника',
    flag: 'default'
}
export = command