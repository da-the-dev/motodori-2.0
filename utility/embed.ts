import { Message, MessageEmbed } from 'discord.js'

export function embed(msg: Message, title: string, content: string, ping?: boolean, send?: true): Promise<Message>
export function embed(msg: Message, title: string, content: string, ping?: boolean, send?: false): MessageEmbed
export function embed(msg: Message, title: string, content = '', ping = false, send = true): MessageEmbed | Promise<Message> {
    const emb = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor('#2F3136')
        .setDescription(`${ping ? `${msg.author}, ` : ''} ${ping ? content[0].toLowerCase() + content.slice(1) || '' : content || ''}`)
        .setFooter(msg.member.displayName, msg.author.displayAvatarURL({ dynamic: true }))
    return send ? msg.channel.send(emb) : emb
}
