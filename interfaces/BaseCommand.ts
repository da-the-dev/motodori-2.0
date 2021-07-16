import { Message, Client } from 'discord.js'

export type Flags = 'default' | 'economy' | 'motodori' | 'privateRooms'
export interface BaseCommand {
    description: string,
    foo: (msg: Message, args: string[], client: Client) => void,
    help: (msg) => void,
    flag: Flags
}