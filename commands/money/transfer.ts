import { BaseCommand } from '../../headers/interfaces'
import { embed, logger } from '../../headers/utility'
import { DBUser } from '../../headers/classes'

const sMsg = 'Передача валюты'
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const mMember = msg.mentions.members.first()
        if (!mMember) {
            embed(msg, sMsg, 'Не указан участник для перевода!', true); return
        }
        const amount = Number(args[1])
        if (!amount || Number.isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
            embed(msg, sMsg, 'Неверная сумма для перевода!', true); return
        }

        const users = await Promise.all([
            new DBUser(msg.guild.id, msg.author.id).fetch(),
            new DBUser(msg.guild.id, mMember.id).fetch()
        ])

        if (users[0].data.money < amount) {
            embed(msg, sMsg, 'У Вас недостаточно средств для перевода!', true); return
        }

        users[0].data.money -= amount
        users[1].data.money += amount

        logger.debug(users.map(u => u.data.money))

        await Promise.all([
            users[0].save(),
            users[1].save()
        ])
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.transfer @Kanto 100 - переведет пользователю Kanto\`
        \`.bal @Kanto - выводит Ваш баланс пользователя Kanto\`
        `)
    },
    description: 'Передает некоторое количество валюты другому пользователю'
}

export = command