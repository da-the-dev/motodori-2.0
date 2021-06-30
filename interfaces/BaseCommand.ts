import { Message, Client } from 'discord.js'

type Flags = 'default' | 'economy' | 'motodori'
export interface BaseCommand {
    description: string,
    foo: (msg: Message, args: string[], client: Client) => void,
    help: (msg) => void,
    flag: Flags
}