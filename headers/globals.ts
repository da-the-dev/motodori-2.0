import { Collection } from "discord.js";
import { DBServer } from "../classes/DBServer";

export var cachedServers: Collection<string, DBServer> = new Collection()

export async function updateCache(id: string) {
    cachedServers.set(id, await new DBServer(id).fetch())
}