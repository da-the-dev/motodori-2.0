import { Message } from 'discord.js'
import { cachedServers } from '../headers/globals'
import { SettingsChannel, SettingsRole } from '../interfaces/Settings'
import { embed } from './embed'

/** Makes sure that role is defined in server settings*/
export function setRoleCheck(msg: Message, sMsg: string, guildID: string, role: SettingsRole): boolean {
    function prettyRoleSwitch(role: SettingsRole) {
        switch (role) {
            case 'admin':
                return 'Администрация'
            case 'moderator':
                return 'Модератор'
            case 'chatMod':
                return 'Чат модератор'
            case 'voiceMod':
                return 'Войс модератор'
            case 'banned':
                return 'Локально забаненный'
            case 'muted':
                return 'Мут'
        }
    }
    const isRole = cachedServers.get(guildID).data.settings.roles[role] ? true : false
    if (!isRole) {
        embed(msg, sMsg, `В настройках сервера не указано, какая роль является ролью *"${prettyRoleSwitch(role)}"*`)
        return false
    }
    return true
}

function prettyChannelSwitch(role: SettingsChannel) {
    switch (role) {
        case 'general':
            return 'Основной'
        case 'flood':
            return 'Флуд'
    }
}
/** Makes sure that channel is defined in server settings*/
export function setChannelCheck(msg: Message, sMsg: string, guildID: string, channel: SettingsChannel): boolean
export function setChannelCheck(guildID: string, channel: SettingsChannel): boolean

export function setChannelCheck(...args: any[]): boolean {
    if (args.length === 4) {
        const msg: Message = args[0]
        const sMsg: string = args[1]
        const guildID: string = args[2]
        const channel: SettingsChannel = args[3]

        const isChannel = cachedServers.get(guildID).data.settings.channels[channel] ? true : false
        if (!isChannel) {
            embed(msg, sMsg, `В настройках сервера не указано, каким каналом является канал *"${prettyChannelSwitch(channel)}"*`)
            return false
        }
        return true
    } else if (args.length === 2) {
        const guildID: string = args[0]
        const channel: SettingsChannel = args[1]
        return cachedServers.get(guildID).data.settings.channels[channel] ? true : false
    } else
        throw new SyntaxError('Incorrect number of arguments!')
}