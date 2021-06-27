import { Client, MessageEmbed } from 'discord.js'
import * as redis from 'redis'
import { DBUser } from '../headers/classes'
import { cachedServers, updateCache } from '../headers/globals'
import { logger } from '../headers/utility'
/**
 * Listens to expired keys
 * @param {Client} client
 */
export function redisHandler(client) {
    const pub = redis.createClient(process.env.RURL)
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired)
    function SubscribeExpired(e, r) {
        const sub = redis.createClient(process.env.RURL)
        const expired_subKey = '__keyevent@0__:expired'
        sub.subscribe(expired_subKey, function() {
            logger.debug(`[DB] Now listeting to '${expired_subKey}' events`)
            sub.on('message', async function(chan, msg) {
                console.log(msg)
                if(msg.startsWith('mute-')) {
                    /**@type {Array<string>} */
                    var data = msg.split('-')
                    data.shift()
                    const guild = client.guilds.cache.get(data[0])
                    var member = guild.member(data[1])
                    if(!member) return

                    const user = await new DBUser(member.guild.id, member.id).fetch()
                    user.data.mute = false
                    await user.save()

                    await updateCache(guild.id)
                    logger.debug(cachedServers.get(guild.id).data.settings)
                    if(member) member.roles.remove(cachedServers.get(guild.id).data.settings.roles.muted)

                    var embed = new MessageEmbed()
                        .setTitle(`Снятие мута`)
                        .setDescription(`<@${member.user.id}> был(-а) размьючен(-а)`)
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setColor('#2F3136')
                    // @ts-ignore
                    guild.channels.cache.get(cachedServers.get(guild.id).data.settings.channels.flood).send(embed)
                }
                // else if(msg == 'lotery') {
                //     utl.lotery.generate(client.guild)
                // }
            })
            return
        })
    }
}