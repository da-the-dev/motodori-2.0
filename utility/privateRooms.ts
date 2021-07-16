import { CategoryChannel, Guild, VoiceChannel, VoiceState } from 'discord.js'
import { cachedServers, updateCache } from '../headers/globals'
import { setChannelCheck } from '../headers/utility'

export const checkForPerms = (guildID: string): boolean =>
    cachedServers.get(guildID).data.flags.includes('privateRooms') &&
    setChannelCheck(guildID, 'privateRoomsCategory') &&
    setChannelCheck(guildID, 'privateRoomsCreator') &&
    cachedServers.get(guildID).data.settings.togglables.privateRooms

/** Makes sure that all correct settings are set */
export function validateChannels(guild: Guild): boolean {
    if (!checkForPerms(guild.id))
        return
    const settings = cachedServers.get(guild.id).data.settings
    const category = guild.channels.cache.get(settings.channels.privateRoomsCategory) as CategoryChannel
    if (!category ||
        category.type != 'category' ||
        category.children.size <= 0)
        return false
    const creator = guild.channels.cache.get(settings.channels.privateRoomsCreator) as VoiceChannel
    if (!creator ||
        creator.type != 'voice')
        return false
    if (settings.roles.muted)
        creator.updateOverwrite(settings.roles.muted, {
            CONNECT: false
        })
    if (settings.roles.banned)
        creator.updateOverwrite(settings.roles.banned, {
            VIEW_CHANNEL: false
        })
    return true
}
export async function refreshCache(guildID: string): Promise<void> {
    if (!cachedServers.get(guildID))
        await updateCache(guildID)
}

export async function createPrivateRoom(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const guild = oldState.guild
    await refreshCache(guild.id)
    if (!checkForPerms(guild.id) || !validateChannels(guild))
        return

    if (oldState.channelID === newState.channelID)
        return
    const settings = cachedServers.get(guild.id).data.settings

    if (newState.channelID === settings.channels.privateRoomsCreator) {
        const c = await guild.channels.create(newState.member.displayName, {
            type: 'voice',
            permissionOverwrites: [
                {
                    id: newState.member.id,
                    allow: ['CREATE_INSTANT_INVITE']
                },
                {
                    id: guild.id,
                    deny: ['CREATE_INSTANT_INVITE']
                }
            ],
            parent: settings.channels.privateRoomsCategory
        })
        if (settings.roles.muted)
            c.updateOverwrite(settings.roles.muted, {
                CONNECT: false
            })
        if (settings.roles.banned)
            c.updateOverwrite(settings.roles.banned, {
                VIEW_CHANNEL: false
            })
        await newState.member.voice.setChannel(c)
    }
}

export async function deletePrivateRoom(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const guild = oldState.guild
    await refreshCache(guild.id)
    if (!checkForPerms(guild.id) || !validateChannels(guild))
        return

    if (oldState.channelID === newState.channelID)
        return
    const settings = cachedServers.get(guild.id).data.settings

    if (oldState.channel && oldState.channel.parentID === settings.channels.privateRoomsCategory)
        if (oldState.channel.members.size <= 0)
            oldState.channel.delete()

}


