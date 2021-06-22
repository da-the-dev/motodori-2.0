import { BaseCommand } from '../../headers/interfaces'
import { DBServer, Menu, Button, Page } from "../../headers/classes";
import { embed, logger, put } from '../../headers/utility'
import { MessageButtonStyles, ExtendedMessage, MessageButton, ExtendedTextChannel } from 'discord-buttons'
import { Message, MessageEmbed, TextChannel } from 'discord.js';

const defaultButton = {
    style: 'gray'
}

// *Pages*
const settingsMenu: Page = {
    name: 'settings',
    embed: new MessageEmbed(
        {
            "title": "Настройки сервера",
            "description": "Для перехода к настройкам сервера, используйте кнопки ниже\n**Описание кнопок**\n`1.` Роли ⏤ настройка ролей, какая роль является какой\n",
            "color": 3092790
        }),
    buttons: [
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка ролей')
                .setID('rolesSetup')
            )
            .setAction(async menu => {
                await menu.sendPage('rolesSetup')
            })
    ]
}

const rolesSetup: Page = {
    name: 'rolesSetup',
    embed: new MessageEmbed({
        "title": "Настройка ролей",
        "description": "Для перехода к настройкам ролей, выберете одну из ролей ниже",
        "color": 3092790
    }),
    buttons: [
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Администрация')
                .setID('admin')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('adminSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Чат модерация')
                .setID('chatMod')
            )
            .setAction(async (menu, button) => {
                const m = await menu.sendEmbed(new MessageEmbed({
                    "title": "Настройки сервера: настройка ролей: чат стафф",
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
            })
    ],
    prev: settingsMenu
}

const adminSetup: Page = {
    name: 'adminSetup',
    embed: new MessageEmbed({
        "title": "Администрация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    buttons: [],
    action: async menu => {
        try {
            const filter = (messsage: Message) => messsage.author.id === menu.clicker.id
            const role = (await menu.channel.awaitMessages(filter, { time: 10000, max: 1 })).first().mentions.roles.first()
            menu.channel.send(role.id)
        } catch (error) {
            if (error instanceof TypeError)
                await menu.delete()
            else
                throw error
        }
    },
    prev: rolesSetup
}

const chatModSetup: Page = {
    name: 'chatModSetup',
    embed: new MessageEmbed({
        "title": "Чат модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    buttons: [],
    action: async menu => {
        try {
            const filter = (messsage: Message) => messsage.author.id === menu.clicker.id
            const role = (await menu.channel.awaitMessages(filter, { time: 10000, max: 1 })).first().mentions.roles.first()
            menu.channel.send(role.id)
        } catch (error) {
            if (error instanceof TypeError)
                await menu.delete()
            else
                throw error
        }
    },
    prev: rolesSetup
}


const sMsg = 'Настройки сервера'
/** @example Usage: `.settings` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        await new Menu(settingsMenu, msg.author, msg.channel as TextChannel)
            .setPage(rolesSetup)
            .setPage(adminSetup)
            .setPage(chatModSetup)
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
