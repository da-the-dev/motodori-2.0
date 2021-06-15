import { Message, MessageEmbed } from 'discord.js'

function embed(msg: Message, title: string, content = '', ping = false, send = true) {
    const emb = new MessageEmbed()
        .setTitle(`${title}`)
        .setDescription(`${ping ? `<@${msg.author}>, ` : ''} ${content || ''}`)
        .setColor('#2F3136')
        .setFooter(msg.member.displayName, msg.author.displayAvatarURL({ dynamic: true }))
    return send ? msg.channel.send(emb) : emb
}

export = embed