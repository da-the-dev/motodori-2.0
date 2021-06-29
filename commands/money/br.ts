import { BaseCommand } from '../../headers/interfaces'
import { embed } from '../../headers/utility'
import { DBUser } from '../../headers/classes'

const sMsg = 'Казино'
/** @example Usage: `.br <bet >= 50>` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const bet = Number(args[0])

        if (!bet || !Number.isInteger(bet)) {
            embed(msg, sMsg, 'не указана ставка!', true)
            return
        }
        if (bet < 50) {
            embed(msg, sMsg, `ставка должна быть больше **50**`, true)
            return
        }

        const user = await new DBUser(msg.guild.id, msg.author.id).fetch()
        if (!user.data.money) {
            embed(msg, sMsg, `у Вас нет денег чтобы играть!`, true)
            return
        }
        if (user.data.money < bet) {
            embed(msg, sMsg, 'ставка больше Вашего баланса!', true)
            return
        }

        if (Math.random() < 0.3) {
            user.data.money += bet * 2
            embed(msg, sMsg, `**Вы выиграли!** Ваш баланс: **${user.data.money}**`, true)
        }
        else {
            user.data.money -= bet
            embed(msg, sMsg, `**Вы проиграли!** Ваш баланс: **${user.data.money}**`, true)
        }

        user.save()
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.br 100 - сыграть в казино на 100 валюты\`
        \`Ставка должна быть больше 50\`
        `)
    },
    description: 'Сыграть в казино',
    flag: 'economy'
}
export = command