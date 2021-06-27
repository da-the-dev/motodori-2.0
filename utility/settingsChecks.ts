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
/** Makes sure that channel is defined in server settings*/
export function setChannelCheck(msg: Message, sMsg: string, guildID: string, channel: SettingsChannel): boolean {
    function prettyChannelSwitch(role: SettingsChannel) {
        switch (role) {
            case 'general':
                return 'Основной'
            case 'flood':
                return 'Флуд'
        }
    }
    const isChannel = cachedServers.get(guildID).data.settings.channels[channel] ? true : false
    if (!isChannel) {
        embed(msg, sMsg, `В настройках сервера не указано, каким каналом является канал *"${prettyChannelSwitch(channel)}"*`)
        return false
    }
    return true
}