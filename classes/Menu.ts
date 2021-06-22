import { MessageButton, ExtendedMessage, ExtendedMessageOptions, MessageComponent, ButtonCollector, ExtendedWebhookClient } from 'discord-buttons'
import { MessageEmbed, TextChannel, DMChannel, NewsChannel, User } from 'discord.js';
import Button from './Button';
import Page from './Page';

class TimeoutError extends Error {
    constructor(message?, name?) {
        super(message)
        name ? this.name = name : null
    }
}

export class Menu {
    private pages: Page[] = []
    private currentMessage: ExtendedMessage
    private clicker: User
    private channel: TextChannel | NewsChannel | DMChannel

    constructor(firstPage: Page, clicker: User, channel: TextChannel | NewsChannel | DMChannel) {
        if (firstPage.name != 'main')
            throw { message: 'Incorrect name of the first page', name: 'FIRST_PAGE_NOT_MAIN' }

        this.pages.push(firstPage)
        this.clicker = clicker
        this.channel = channel
    }

    setPage(page: Page) {
        if (page.prev)
            page.buttons.push(new Button()
                .setButton(new MessageButton()
                    .setStyle(2)
                    .setLabel('Назад')
                    .setID(`${page.name}-back`))
                .setAction(async menu => {
                    await menu.sendPage(page.prev.name)
                })
            )
        else
            page.buttons.push(new Button()
                .setButton(new MessageButton()
                    .setStyle(2)
                    .setLabel('Назад')
                    .setID(`${page.name}-back`))
                .setAction(async menu => {
                    await menu.sendPage('main')
                })
            )

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

                page.buttons.find(b => b.button.custom_id == button.id).action(this, button, page)
            } catch (error) {
                if (error instanceof TimeoutError)
                    this.currentMessage.delete()
                else
                    throw error
            }
        })
    }

}