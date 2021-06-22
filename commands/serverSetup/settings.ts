import { BaseCommand } from '../../headers/interfaces'
import { DBServer } from "../../headers/classes";
import { embed, logger, put } from '../../headers/utility'
import { Menu, Button, Page } from '../../classes/Menu'
import { MessageButtonStyles, ExtendedMessage, MessageButton, ExtendedTextChannel } from 'discord-buttons'
import { Message, MessageEmbed } from 'discord.js';

const defaultButton = new MessageButton()
    .setStyle(2)

// *Pages*
const settingsMenu: Page = {
    name: 'main',
    embed: new MessageEmbed(
        {
            "title": "Настройки сервера",
            "description": "Для перехода к настройкам сервера, используйте кнопки ниже\n**Описание кнопок**\n`1.` Роли ⏤ настройка ролей, какая роль является какой\n",
            "color": 3092790
        }),
    buttons: [
        {
            button: new MessageButton()
                .setStyle(2)
                .setLabel('Настройка ролей')
                .setID('rolesSetup'),
            action: (menu, page, button) => {
                menu.sendPage('rolesSetup')
            }
        } as Button
    ]
}

const rolesSetup: Page = {
    name: 'rolesSetup',
    embed: new MessageEmbed({
        "title": "Настройки сервера: настройка ролей",
        "description": "Для перехода к настройкам ролей, выберете одну из ролей ниже",
        "color": 3092790
    }),
    buttons: [
        {
            button: new MessageButton()
                .setStyle(2)
                .setLabel('Администрация')
                .setID('rolesSetup-admin'),
            action: async (menu, page, button) => {
                const m = await menu.sendEmbed(new MessageEmbed({
                    "title": "Настройки сервера: настройка ролей: администрация",
                    "description": "Теперь упомяните роль и отправьте сообщение",
                    "color": 3092790
                }))
                const filter = (messsage: Message) => messsage.author.id === button.clicker.user.id
                try {
                    const role = (await m.channel.awaitMessages(filter, { time: 10000, max: 1 })).first().mentions.roles.first()
                    button.message.channel.send(role.id)
                } catch (error) {
                    if (error instanceof TypeError)
                        await menu.delete()
                    else
                        throw error
                }
            }
        } as Button
    ]
}

const sMsg = 'Настройки сервера'
/** @example Usage: `.settings` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        const menu = await new Menu(settingsMenu, msg.author, msg.channel)
            .setPage(rolesSetup)
            .send()


    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.give @Kanto 100 - выдаст пользователю Kanto 100 валюты\`
        \`.give @Kanto -100 - заберет у пользователя Kanto 100 валюты\`
        `)
    },
    description: 'Выдает участнику валюту',
    flag: 'economy'
}
export = command
