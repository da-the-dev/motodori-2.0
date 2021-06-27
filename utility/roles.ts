import { Message } from 'discord.js'
import { cachedServers } from '../headers/globals'
import { SettingsChannel, SettingsRole } from '../interfaces/Settings'
import { embed } from './embed'

function prettySwitch(role: SettingsRole) {
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

/** Makes sure member has a role that is on the same position or above the given role */
export function roleCheck(msg: Message, sMsg: string, role: SettingsRole): boolean {
    const member = msg.member

    const roleID = cachedServers.get(member.guild.id).data.settings.roles[role]
    if (!roleID) {
        embed(msg, sMsg, `В настройках сервера не указано, какая роль является ролью *"${prettySwitch(role)}"*`)
        return false
    }
    const discordRole = member.guild.roles.cache.get(roleID)
    if (!msg.member.roles.cache.find(r => r.position >= discordRole.position)) {
        embed(msg, sMsg, 'У Вас нет прав на эту команду!')
        return false
    }
    return true
}

/** Makes sure that a settings is set*/
export function roleSetRoleCheck(msg: Message, sMsg: string, guildID: string, role: SettingsRole): boolean {
    const isRole = cachedServers.get(guildID).data.settings.roles[role] ? true : false
    if (!isRole) {
        embed(msg, sMsg, `В настройках сервера не указано, какая роль является ролью *"${prettySwitch(role)}"*`)
        return false
    }
    return true
}