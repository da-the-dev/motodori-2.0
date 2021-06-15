import { Message, Client } from "discord.js"
export interface BaseCommand {
    foo: (msg: Message, args: string[], client: Client) => void
    description: string
}