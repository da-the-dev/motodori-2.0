import { MessageEmbed } from 'discord.js';
import { logger } from '../utility/logger';
import Button from './Button';
import Menu from './Menu';
import OneWay from './OneWay';
import Toggle from './Toggle';
type AnyButton = Button | Toggle | OneWay


export default class Page {
    name: string
    embed: MessageEmbed
    buttons?: AnyButton[]
    prev?: Page
    action?: (menu: Menu, currentPage?: Page) => void
    setup?: boolean

    constructor(data: Page) {
        this.name = data.name
        this.embed = data.embed
        this.buttons = data.buttons
        this.prev = data.prev
        this.action = data.action
        this.setup = false
    }
}
