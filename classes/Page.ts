import { MessageEmbed } from 'discord.js';
import Button from './Button';
import Menu from './Menu';
export default class Page {
    name: string
    embed: MessageEmbed
    buttons?: Button[]
    prev?: Page
    action?: (menu: Menu, currentPage?: Page) => void

    constructor(name: string, embed: MessageEmbed, buttons?: Button[], prev?: Page, action?: (menu: Menu, currentPage?: Page) => void) {
        this.name = name
        this.embed = embed
        this.buttons = buttons
        this.prev = prev
        this.action = action
    }
}
