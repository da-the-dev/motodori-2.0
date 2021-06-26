import { Message } from "discord.js";
import { cachedServers } from "../headers/globals";
import { SettingsRole } from "../interfaces/Settings";
import { embed } from "./embed";

/** Makes sure member has a role that is on the same position or above the given role */
export function roleCheck(msg: Message, sMsg: string, role: SettingsRole) {
    const member = msg.member
    var coolRole = ''
    switch (role) {
        case 'admin':
            coolRole = 'Администрация'
            break
        case 'moderator':
            coolRole = 'Модератор'
            break
        case 'chatMod':
            coolRole = 'Чат модератор'
            break
        case 'voiceMod':
            coolRole = 'Войс модератор'
            break
    }
    const roleID = cachedServers.get(member.guild.id).data.settings.roles.admin
    if (!roleID) {
        embed(msg, sMsg, `В настройках сервера не указано, какая роль является ролью *"${coolRole}"*`)
        return false
    }
    const discordRole = member.guild.roles.cache.get(roleID)
    if (!msg.member.roles.cache.find(r => r.position >= discordRole.position)) {
        embed(msg, sMsg, 'У Вас нет прав на эту команду!')
        return false
    }
    return true
}