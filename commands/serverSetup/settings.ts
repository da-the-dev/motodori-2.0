import { MessageButton } from 'discord-buttons'
import { BaseCommand } from '../../headers/interfaces'
import { DBServer, Menu, Button, Toggle, OneWay, Page } from "../../headers/classes";
import { embed, logger } from '../../headers/utility'
import { Message, MessageEmbed, TextChannel } from 'discord.js';

const defaultButton = {
    style: 'gray'
}
// *Pages*
// Main page
const settingsMenu = new Page()
    .setName('settings')
    .setEmbed(new MessageEmbed({
        "title": "Настройки сервера",
        "description": "Для перехода к настройкам сервера, используйте кнопки ниже\n**Описание кнопок**\n`1.` Роли ⏤ настройка ролей, какая роль является какой\n",
        "color": 3092790
    }))
    .setButtons([
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка ролей')
                .setID('rolesSetup')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('rolesSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка каналов')
                .setID('channelSetup')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('channelSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка функционала')
                .setID('togglables')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('togglables')
            })
    ])

// Roles setup
const rolesSetup = new Page()
    .setName('rolesSetup')
    .setEmbed(new MessageEmbed({
        "title": "Настройка ролей",
        "description": "Для перехода к настройкам ролей, выберете одну из них ниже\n**Описание ролей:**\n`1.` *Администрация* ⏤ администраторы сервера\n`2.` *Модераторы* ⏤ модераторы сервера, на уровень ниже администрации\n`3.` *Чат модераторы* ⏤ модераторы сервера, ответственные за порядок в текстовых чатах. На уровень ниже модераторов.\n`4.` *Войс модераторы* ⏤ модераторы сервера, ответственные за порядок в голосовых чатах. На уровень ниже чат модераторов.",
        "color": 3092790
    }))
    .setButtons([
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Администрация')
                .setID('admin')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('adminSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Модератор')
                .setID('moderator')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('moderatorSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Чат модераторы')
                .setID('chatMod')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('chatModSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Голосовая модерация')
                .setID('voiceMod')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('voiceModSetup')
            })
    ])
    .setPrev(settingsMenu)

const adminSetup = new Page()
    .setName('adminSetup')
    .setEmbed(new MessageEmbed({
        "title": "Администрация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }))
    .setAction(async page => {
        await saveRoleToSettings(page.menu, 'admin')
    })
    .setPrev(rolesSetup)

const moderatorSetup = new Page()
    .setName('moderatorSetup')
    .setEmbed(new MessageEmbed({
        "title": "Модераторы",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }))
    .setAction(async page => {
        await saveRoleToSettings(page.menu, 'moderator')
    })
    .setPrev(rolesSetup)

const chatModSetup = new Page()
    .setName('chatModSetup')
    .setEmbed(new MessageEmbed({
        "title": "Чат модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }))
    .setAction(async page => {
        await saveRoleToSettings(page.menu, 'chatMod')
    })
    .setPrev(rolesSetup)

const voiceModSetup = new Page()
    .setName('voiceModSetup')
    .setEmbed(new MessageEmbed({
        "title": "Войс модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }))
    .setAction(async page => {
        await saveRoleToSettings(page.menu, 'voiceMod')
    })
    .setPrev(rolesSetup)

const roleSetupSuccess = new Page()
    .setName('roleSetupSuccess')
    .setEmbed(new MessageEmbed({
        "title": "Успешно",
        "description": "Роль успешно установлена!",
        "color": 3092790
    }))
    .setPrev(rolesSetup)

const roleSetupFail = new Page()
    .setName('roleSetupFail')
    .setEmbed(new MessageEmbed({
        "title": "Oшибка!",
        "description": "Неверно указана роль! Начните настройку заново!",
        "color": 3092790
    }))
    .setPrev(rolesSetup)

// Channels setup
const channelSetup = new Page()
    .setName('channelSetup')
    .setEmbed(new MessageEmbed({
        "title": "Настройка каналов",
        "description": "Для перехода к настройкам каналов, выберете один из них из них ниже\n**Описание каналов:**\n`1.` *Основной* ⏤ основной текстовый канал сервера\n`2.` *Флуд* ⏤ канал, в котором будут писаться команды\n`3.` *Настройка приватных комнат* ⏤ настройка приватных комнат\n",
        "color": 3092790
    }))
    .setButtons([
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Основной')
                .setID('general')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('generalSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Флуд')
                .setID('flood')
            )
            .setAction(async button => {
                await button.page.menu.sendPage('moderatorSetup')
            }),
        new Button()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Настройка приватных комнат')
                .setID('privateRoomsSetup')
                .setDisabled(true)
            )
            .setAction(async button => {
                await button.page.menu.sendPage('privateRoomsSetup')
            })
    ])
    .setPrev(settingsMenu)

const generalSetup = new Page()
    .setName('generalSetup')
    .setEmbed(new MessageEmbed({
        "title": "Основной",
        "description": "Теперь отправьте ID канала",
        "color": 3092790
    }))
    .setAction(async page => {
        await saveChannelIDToSettings(page.menu, 'general', 'text')
    })
    .setPrev(channelSetup)

const channelSetupSuccess = new Page()
    .setName('channelSetupSuccess')
    .setEmbed(new MessageEmbed({
        "title": "Успешно",
        "description": "Канал успешно установлен!",
        "color": 3092790
    }))
    .setPrev(channelSetup)
const channelSetupFail = new Page()
    .setName('channelSetupFail')
    .setEmbed(new MessageEmbed({
        "title": "Oшибка!",
        "description": "Неверно указан ID! Начните настройку заново!",
        "color": 3092790
    }))
    .setPrev(rolesSetup)

// Togglables
const togglables = new Page()
    .setName('togglables')
    .setEmbed(new MessageEmbed({
        "title": "Настройки функционала",
        "description": "Здесь Вы можете настроить, какой функционал бота включить или выключить\n**Описание кнопок**\n`1.` *Защита основного канала* ⏤ включает/отключает защиту основного канала от написания команд бота. Сообщения с командами будут удаляться и основного чата.\n",
        "color": 3092790
    }))
    .setButtons([
        new Toggle()
            .setButton(new MessageButton(defaultButton)
                .setLabel('Защита основного канала')
                .setID('generalProtection')
            )
            .setOn(async button => {
                const server = await new DBServer(button.page.menu.guild.id).fetch()
                server.data.settings.togglables.generalProtection = true
                await server.save()
            })
            .setOff(async button => {
                const server = await new DBServer(button.page.menu.guild.id).fetch()
                server.data.settings.togglables.generalProtection = false
                await server.save()
            })
            .setInit(async button => {
                const server = await new DBServer(button.page.menu.guild.id).fetch()
                logger.debug('generalProtection', server.data.settings.togglables.generalProtection)
                button.setState(server.data.settings.togglables.generalProtection || false)
            })
    ])
    .setPrev(settingsMenu)

const sMsg = 'Настройки сервера'
/** @example Usage: `.settings` */
const command: BaseCommand = {
    foo: async (msg, args, client) => {
        await new Menu(msg.guild, msg.channel as TextChannel, msg.author)
            .addPages([
                settingsMenu,

                rolesSetup,
                adminSetup,
                moderatorSetup,
                chatModSetup,
                voiceModSetup,
                roleSetupSuccess,
                roleSetupFail,

                channelSetup,
                generalSetup,
                channelSetupSuccess,
                channelSetupFail,

                togglables
            ])
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
        await menu.sendPage('roleSetupFail')
        return
    }
    const server = await new DBServer(menu.channel.guild.id).fetch();
    server.data.settings.roles[name] = role.id
    await server.save()
    await menu.sendPage('roleSetupSuccess')
}
async function saveChannelIDToSettings(menu: Menu, name: string, type: 'text' | 'category' | 'voice') {
    const filter = (messsage: Message) => messsage.author.id === menu.clicker.id;
    const id = (await menu.channel.awaitMessages(filter, { time: 60000, max: 1 })).first().content
    const channel = menu.channel.guild.channels.cache.get(id)
    if (!id || !channel || channel.type != type) {
        await menu.sendPage('channelSetupFail')
        return
    }
    const server = await new DBServer(menu.channel.guild.id).fetch();
    server.data.settings.channels[name] = id
    await server.save()
    await menu.sendPage('channelSetupSuccess')
}

