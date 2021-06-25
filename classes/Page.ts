import { MessageEmbed } from 'discord.js';
import { logger } from '../utility/logger';
import Button from './Button';
import Menu from './Menu';
import OneWay from './OneWay';
import Toggle from './Toggle';
type AnyButton = Button | Toggle | OneWay

interface PageOptions {
    name: string
    embed: MessageEmbed
    buttons?: AnyButton[]
    prev?: Page
    action?: (menu: Menu, currentPage?: Page) => void
    setup?: boolean
}

export default class Page {
    name: string
    embed: MessageEmbed
    buttons?: AnyButton[]
    prev?: Page
    action?: (menu: Menu, currentPage?: Page) => void
    setup?: boolean

    constructor(data: PageOptions) {
        this.name = data.name
        this.embed = data.embed
        this.buttons = data.buttons
        this.prev = data.prev
        this.action = data.action
        this.setup = false
    }

    setName(name: string) {
        this.name = name
        return this
    }
    setEmbed(embed: MessageEmbed) {
        this.embed = embed
        return this
    }
    setButtons(buttons: AnyButton[]) {
        this.buttons = buttons
        return this
    }
    setAction(action: (menu: Menu, currentPage?: Page) => void) {
        this.action = action
        return this
    }
}
