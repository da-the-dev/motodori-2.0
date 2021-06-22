import { MessageButton, ExtendedMessage, ExtendedMessageOptions, MessageComponent, ButtonCollector, ExtendedWebhookClient } from 'discord-buttons'
import { Message, MessageEmbed, TextChannel, DMChannel, NewsChannel, User } from 'discord.js';
import { logger } from '../headers/utility'

class TimeoutError extends Error {
    constructor(message?, name?) {
        super(message)
        name ? this.name = name : null
    }
}

export interface Button {
    button: MessageButton,
    action: (menu: Menu, currentPage: Page, button: MessageComponent) => void
}

export interface Page {
    name: string,
    embed: MessageEmbed,
    buttons: Button[],
    prev?: Page
}

export class Menu {
    private pages: Page[] = []
    private currentMessage: ExtendedMessage
    private clicker: User
    private channel: TextChannel | NewsChannel | DMChannel

    constructor(firstPage: Page, clicker: User, channel: TextChannel | NewsChannel | DMChannel) {
        firstPage.name = 'main'
        this.pages.push(firstPage)
        this.clicker = clicker
        this.channel = channel
    }

    setPage(page: Page) {
        if (page.prev) {
            page.buttons.push({
                'button': new MessageButton()
                    .setStyle(2)
                    .setLabel('Назад')
                    .setID(`${page.name}-back`),
                action: async (menu, page, button) => {
                    await menu.sendPage(page.prev.name)
                }
            })
        } else {
            page.buttons.push({
                'button': new MessageButton()
                    .setStyle(2)
                    .setLabel('Назад')
                    .setID(`${page.name}-back`),
                action: async (menu, page, button) => {
                    await menu.sendPage('main')
                }
            })
        }
        this.pages.push(page)
        return this
    }

    async send() {
        const page = this.pages.find(p => p.name == 'main')
        this.currentMessage = await this.channel.send({ embed: page.embed, buttons: page.buttons.map(b => b.button) } as ExtendedMessageOptions) as ExtendedMessage
        this.addListener(page)
        return this
    }

    async sendPage(name: string) {
        const page = this.pages.find(p => p.name == name)
        logger.debug(page.name)
        this.currentMessage = await this.currentMessage.edit({ embed: page.embed, buttons: page.buttons.map(b => b.button) } as ExtendedMessageOptions) as ExtendedMessage

        this.addListener(page)
        return this.currentMessage
    }

    async clearButtons() {
        this.currentMessage = await this.currentMessage.edit({ embed: this.currentMessage.embeds[0], buttons: null } as ExtendedMessageOptions) as ExtendedMessage
        return this.currentMessage
    }
    async sendEmbed(emb: MessageEmbed) {
        await this.clearButtons()
        this.currentMessage = await this.currentMessage.edit({ embed: emb }) as ExtendedMessage
        return this.currentMessage
    }
    async delete() {
        await this.currentMessage.delete()
    }

    async addListener(page: Page) {
        const filter = (button: MessageComponent) => button.clicker.user.id === this.clicker.id
        const collector = this.currentMessage.createButtonCollector(filter, { max: 1, time: 60000 })
        collector.on('end', collected => {
            try {
                const button = collected.first();
                button ? button.defer() : (() => { throw new TimeoutError() })()

                page.buttons.find(b => b.button.custom_id == button.id).action(this, page, button)
            } catch (error) {
                if (error instanceof TimeoutError)
                    this.currentMessage.delete()
                else
                    throw error
            }
        })
    }

}