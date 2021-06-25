import { MessageButton } from 'discord-buttons'
import { BaseCommand } from '../../headers/interfaces'
import { DBServer, Menu, Button, Page } from "../../headers/classes";
import { embed, logger } from '../../headers/utility'
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Toggle from '../../classes/Toggle';
import OneWay from '../../classes/OneWay';

const defaultButton = {
    style: 'gray'
}
// *Pages*
// Main page
const settingsMenu = new Page({
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
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка каналов')
                .setID('channelSetup')
            )
            .setAction(async menu => {
                await menu.sendPage('channelSetup')
            })
    ]
})

// Roles setup
const rolesSetup = new Page({
    name: 'rolesSetup',
    embed: new MessageEmbed({
        "title": "Настройка ролей",
        "description": "Для перехода к настройкам ролей, выберете одну из них ниже\n**Описание ролей:**\n`1.` *Администрация* ⏤ администраторы сервера\n`2.` *Модераторы* ⏤ модераторы сервера, на уровень ниже администрации\n`3.` *Чат модераторы* ⏤ модераторы сервера, ответственные за порядок в текстовых чатах. На уровень ниже модераторов.\n`4.` *Войс модераторы* ⏤ модераторы сервера, ответственные за порядок в голосовых чатах. На уровень ниже чат модераторов.",
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
                .setLabel('Модератор')
                .setID('moderator')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('moderatorSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Чат модераторы')
                .setID('chatMod')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('chatModSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Голосовая модерация')
                .setID('voiceMod')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('voiceModSetup')
            })
    ],
    prev: settingsMenu
})
const adminSetup = new Page({
    name: 'adminSetup',
    embed: new MessageEmbed({
        "title": "Администрация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    action: async menu => {
        await saveRoleToSettings(menu, 'admin')
    },
    prev: rolesSetup
})
const moderatorSetup = new Page({
    name: 'moderatorSetup',
    embed: new MessageEmbed({
        "title": "Модераторы",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    action: async menu => {
        await saveRoleToSettings(menu, 'moderator')
    },
    prev: rolesSetup
})
const chatModSetup = new Page({
    name: 'chatModSetup',
    embed: new MessageEmbed({
        "title": "Чат модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    action: async menu => {
        await saveRoleToSettings(menu, 'chatMod')
    },
    prev: rolesSetup
})
const voiceModSetup = new Page({
    name: 'voiceModSetup',
    embed: new MessageEmbed({
        "title": "Войс модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    action: async menu => {
        await saveRoleToSettings(menu, 'voiceMod')
    },
    prev: rolesSetup
})
const roleSetupSuccess = new Page({
    name: 'roleSetupSuccess',
    embed: new MessageEmbed({
        "title": "Успешно",
        "description": "Роль успешно установлена!",
        "color": 3092790
    }),
    prev: rolesSetup
})

// Channels setup
const channelSetup = new Page({
    name: 'channelSetup',
    embed: new MessageEmbed({
        "title": "Настройка каналов",
        "description": "Для перехода к настройкам каналов, выберете один из них из них ниже\n**Описание каналов:**\n`1.` *Основной* ⏤ основной текстовый канал сервера\n`2.` *Флуд* ⏤ канал, в котором будут писаться команды\n`3.` *Настройка приватных комнат* ⏤ настройка приватных комнат\n",
        "color": 3092790
    }),
    buttons: [
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Основной')
                .setID('general')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('generalSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Флуд')
                .setID('flood')
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('moderatorSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка приватных комнат')
                .setID('privateRoomsSetup')
                .setDisabled(true)
            )
            .setAction(async (menu, button) => {
                await menu.sendPage('privateRoomsSetup')
            })
    ],
    prev: settingsMenu
})
const generalSetup = new Page({
    name: 'generalSetup',
    embed: new MessageEmbed({
        "title": "Основной",
        "description": "Теперь отправьте ID канала",
        "color": 3092790
    }),
    action: async menu => {
        await saveChannelIDToSettings(menu, 'general', 'text')
    },
    prev: channelSetup
})
const channelSetupSuccess = new Page({
    name: 'channelSetupSuccess',
    embed: new MessageEmbed({
        "title": "Успешно",
        "description": "Канал успешно установлен!",
        "color": 3092790
    }),
    prev: channelSetup
})

// Togglables setup
// const 

// Functionality toggles
const sMsg = 'Настройки сервера'
/** @example Usage: `.settings` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        await new Menu([
            settingsMenu,

            rolesSetup,
            adminSetup,
            moderatorSetup,
            chatModSetup,
            voiceModSetup,
            roleSetupSuccess,

            channelSetup,
            generalSetup,
            channelSetupSuccess
        ], msg.author, msg.channel as TextChannel)
            .send()
    },
    help: (msg) => {
        embed(msg, sMsg + ': помощь', `
        Пример работы команды:
        \`.settings - открывает настройки сервера\`
        `)
    },
    description: 'Открывает настройки сервера',
    flag: 'default'
}
export = command

async function saveRoleToSettings(menu: Menu, name: string) {
    const filter = (messsage: Message) => messsage.author.id === menu.clicker.id;
    const role = (await menu.channel.awaitMessages(filter, { time: 60000, max: 1 })).first().mentions.roles.first()
    if (!role) {
        menu.currentMessage.edit({
            embed: new MessageEmbed(
                {
                    "description": "Неверно указана роль! Начните настройку заново!",
                    "color": 3092790
                }
            ).setTitle(menu.currentMessage.embeds[0].title)
        })
        return
    }
    const server = await new DBServer(menu.channel.guild.id).fetch();
    server.data.settings.roles[name] = role.id
    await server.save()
    await menu.sendPage('roleSetupSuccess')
    logger.debug(menu.currentMessage ? true : false)
}
async function saveChannelIDToSettings(menu: Menu, name: string, type: 'text' | 'category' | 'voice') {
    const filter = (messsage: Message) => messsage.author.id === menu.clicker.id;
    const id = (await menu.channel.awaitMessages(filter, { time: 60000, max: 1 })).first().content
    const channel = menu.channel.guild.channels.cache.get(id)
    if (!id || !channel || channel.type != type) {
        menu.currentMessage.edit({
            embed: new MessageEmbed(
                {
                    "description": "Неверно указан ID! Начните настройку заново!",
                    "color": 3092790
                }
            ).setTitle(menu.currentMessage.embeds[0].title)
        })
        return
    }
    const server = await new DBServer(menu.channel.guild.id).fetch();
    server.data.settings.channels[name] = id
    await server.save()
    await menu.sendPage('channelSetupSuccess')
}

