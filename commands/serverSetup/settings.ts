import { BaseCommand } from '../../headers/interfaces'
import { Menu, Button, Page, DBServer } from "../../headers/classes";
import { embed, logger, put } from '../../headers/utility'
import { MessageButton } from 'discord-buttons'
import { Message, MessageEmbed, TextChannel } from 'discord.js';

const defaultButton = {
    style: 'gray'
}

// *Pages*
// Main page
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

// Roles setup
const rolesSetup: Page = {
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
        await saveRoleToSettings(menu, 'admin')
        await menu.sendPage('roleSetupSuccess')
    },
    prev: rolesSetup
}
const moderatorSetup: Page = {
    name: 'moderatorSetup',
    embed: new MessageEmbed({
        "title": "Модераторы",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    buttons: [],
    action: async menu => {
        await saveRoleToSettings(menu, 'moderator')
        await menu.sendPage('roleSetupSuccess')
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
        await saveRoleToSettings(menu, 'chatMod')
        await menu.sendPage('roleSetupSuccess')
    },
    prev: rolesSetup
}
const voiceModSetup: Page = {
    name: 'voiceModSetup',
    embed: new MessageEmbed({
        "title": "Войс модерация",
        "description": "Теперь упомяните роль и отправьте сообщение",
        "color": 3092790
    }),
    buttons: [],
    action: async menu => {
        await saveRoleToSettings(menu, 'voiceMod')
        await menu.sendPage('roleSetupSuccess')
    },
    prev: rolesSetup
}
const roleSetupSuccess: Page = {
    name: 'roleSetupSuccess',
    embed: new MessageEmbed({
        "title": "Успешно",
        "description": "Роль успешно установлена!",
        "color": 3092790
    }),
    buttons: [],
    action: menu => {
        menu.delete(5000)
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
            .setPage(moderatorSetup)
            .setPage(chatModSetup)
            .setPage(voiceModSetup)
            .setPage(roleSetupSuccess)
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
    try {
        const filter = (messsage: Message) => messsage.author.id === menu.clicker.id;
        const role = (await menu.channel.awaitMessages(filter, { time: 60000, max: 1 })).first().mentions.roles.first();
        const server = await new DBServer(menu.channel.guild.id).fetch();
        server.data.settings.roles[name] = role.id
        await server.save()
        return
    } catch (error) {
        if (error instanceof TypeError && this.currentMessage.deletable)
            await menu.delete()
        else
            throw error
    }
}

