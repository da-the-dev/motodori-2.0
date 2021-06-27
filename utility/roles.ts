import { Message } from 'discord.js'
import { cachedServers } from '../headers/globals'
import { SettingsRole } from '../interfaces/Settings'
import { embed } from './embed'
import { setRoleCheck } from './settingsChecks'

/** Makes sure member has a role that is on the same position or above the given role */
export function roleCheck(msg: Message, sMsg: string, role: SettingsRole): boolean {
    const member = msg.member

    if (!setRoleCheck(msg, sMsg, msg.guild.id, role))
        return false
    const discordRole = member.guild.roles.cache.get(cachedServers.get(msg.guild.id).data.settings.roles[role])
    if (!msg.member.roles.cache.find(r => r.position >= discordRole.position)) {
        embed(msg, sMsg, 'У Вас нет прав на эту команду!')
        return false
    }
    return true
}