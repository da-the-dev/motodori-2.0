import { BaseCommand } from '../../headers/interfaces'
import { embed, timeCalculator } from '../../headers/utility'
import { DBUser } from '../../headers/classes'
const sMsg = 'Временные награды'

/** @example Usage: `.timely` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const user = await new DBUser(msg.guild.id, msg.author.id).fetch()

        if (user.data.rewardTimestamp) { // Check if user can collect the reward
            var diff = Math.floor((msg.createdTimestamp - user.data.rewardTimestamp) / 1000)
            if (diff >= 12 * 60 * 60) { // If 12+ hours passed since last reward collection
                if (diff < 24 * 60 * 60 * 1000) { // And less than 24 
                    var reward = 20 + user.data.streak * 10
                    user.data.money += reward
                    user.data.streak += 1

                    if (user.data.streak == 14)
                        user.data.streak = 1

                    user.data.rewardTimestamp = msg.createdTimestamp
                    await user.save()

                    embed(msg, sMsg, `<@${msg.author.id}>, вы забрали свои **${reward}**. Приходите через **12** часов`)
                } else {
                    var reward = 20 + user.data.streak * 10
                    user.data.money += reward
                    user.data.rewardTimestamp = msg.createdTimestamp
                    await user.save()

                    embed(msg, sMsg, `<@${msg.author.id}>, вы пришли слишком поздно! Вы получаете **${reward}**`)
                }
            } else {
                var time = 12 * 60 - Math.floor(((msg.createdTimestamp - user.data.rewardTimestamp) / 1000) / 60)

                embed(msg, sMsg, `<@${msg.author.id}>, вы пришли слишком рано! Приходите через ${timeCalculator(time)}`)
            }
        } else { // If user never used .timely, but has some data
            user.data.rewardTimestamp = msg.createdTimestamp
            user.data.streak = 1
            user.data.money ? user.data.money += 20 : user.data.money = 20

            await user.save()

            embed(msg, sMsg, `<@${msg.author.id}>, вы забрали свои **20**`)
        }
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.timely - забрать награду\`
        `)
    },
    description: 'Забрать награду',
    flag: 'economy'
}
export = command