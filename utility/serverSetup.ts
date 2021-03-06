import { Guild, TextChannel, MessageEmbed } from 'discord.js'
import { Connection } from '../headers/classes'
import { Server } from '../headers/interfaces'

function getDefaultChannel(guild: Guild): TextChannel {
    if (guild.channels.cache.has(guild.id))
        return guild.channels.cache.get(guild.id) as TextChannel

    const generalChannel = guild.channels.cache.find(channel => channel.name === 'general') as TextChannel
    if (generalChannel)
        return generalChannel
    return guild.channels.cache
        .filter(c => c.type === 'text' &&
            c.permissionsFor(guild.client.user).has('SEND_MESSAGES'))
        .sort((a, b) => a.position - b.position).first() as TextChannel
}

export async function setupServer(guild: Guild): Promise<void> {
    const firstChannel = guild.channels.cache.get(getDefaultChannel(guild).id) as TextChannel
    firstChannel.send(new MessageEmbed()
        .setTitle('Спасибо что добавили бота Kantō!'))
    if (await Connection.getConnection().get(guild.id, 'serverSettings') === {})
        await Connection.getConnection().set(guild.id, 'serverSettings', {
            id: 'serverSettings',
            flags: ['default']
        } as Server)
}