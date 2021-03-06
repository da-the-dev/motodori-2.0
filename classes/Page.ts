import { MessageEmbed } from 'discord.js'
import Menu from './Menu'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utility/logger'
import BaseButton from './BaseButton'

// export type AnyButton = Button | Toggle | OneWay

export default class Page {
    name: string
    embed: MessageEmbed
    menu: Menu
    buttons?: BaseButton[]
    prev?: Page
    action?: (page: Page) => void
    setup?: boolean

    setName(name: string): Page {
        this.name = name
        return this
    }
    setEmbed(embed: MessageEmbed): Page {
        this.embed = embed
        return this
    }
    setButtons(buttons: BaseButton[]): Page {
        this.buttons = buttons
        return this
    }
    setAction(action: (page: Page) => void): Page {
        this.action = action
        return this
    }
    setPrev(prev: Page): Page {
        this.prev = prev
        return this
    }
}
