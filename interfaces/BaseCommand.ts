import { Message, Client } from "discord.js"
export interface BaseCommand {
    description: string,
    foo: (msg: Message, args: string[], client: Client) => void,
    help: (msg) => void,
    flag: string
}