import { Message, MessageEmbed } from 'discord.js'

function embed(msg: Message, title: string, content = '', ping = false, send = true) {
    const emb = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor('#2F3136')
        .setDescription(`${ping ? `${msg.author}, ` : ''} ${ping ? content[0].toLowerCase() + content.slice(1) || '' : content || ''}`)
        .setFooter(msg.member.displayName, msg.author.displayAvatarURL({ dynamic: true }))
    return send ? msg.channel.send(emb) : emb
}

export = embed