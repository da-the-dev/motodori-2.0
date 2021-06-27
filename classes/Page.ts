import { ButtonCollector } from 'discord-buttons';
import { MessageEmbed } from 'discord.js';
import { logger } from '../utility/logger';
import Button from './Button';
import Menu from './Menu';
import OneWay from './OneWay';
import Toggle from './Toggle';
export type AnyButton = Button | Toggle | OneWay

export default class Page {
    name: string
    embed: MessageEmbed
    menu: Menu
    buttons?: AnyButton[]
    prev?: Page
    action?: (page: Page) => void
    setup?: boolean

    constructor() { }

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
    setAction(action: (page: Page) => void) {
        this.action = action
        return this
    }
    setPrev(prev: Page) {
        this.prev = prev
        return this
    }
}
