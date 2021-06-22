import { MessageEmbed } from 'discord.js';
import Button from './Button';
export default class Page {
    name: string
    embed: MessageEmbed
    buttons: Button[]
    prev?: Page

    constructor(name: string, embed: MessageEmbed, buttons: Button[], prev?: Page) {
        this.name = name
        this.embed = embed
        this.buttons = buttons
        this.prev = prev
    }
}
