import { Collection } from 'discord.js'
import { DBServer } from '../classes/DBServer'

export const cachedServers: Collection<string, DBServer> = new Collection()

export async function updateCache(id: string): Promise<void> {
    cachedServers.set(id, await new DBServer(id).fetch())
}