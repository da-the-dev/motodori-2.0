import { MessageButton, ExtendedMessage, ExtendedMessageOptions, MessageComponent } from 'discord-buttons'
import { MessageEmbed, TextChannel, DMChannel, NewsChannel, User } from 'discord.js';
import { logger } from '../utility/logger';
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
    public clicker: User
    public channel: TextChannel

    constructor(firstPage: Page, clicker: User, channel: TextChannel) {
        // if (firstPage.name != 'main') throw new SyntaxError('First page\'s name must be "main"')
        if (firstPage.buttons.length <= 0) throw new SyntaxError('First page must have buttons')

        firstPage.buttons.forEach(b => {
            b.button.custom_id = `${channel.guild.id}-${firstPage.name}-${b.button.custom_id}`
        })

        this.pages.push(firstPage)
        this.clicker = clicker
        this.channel = channel
    }

    setPage(page: Page) {
        if (!page.prev) throw new ReferenceError('No previous page defined in a secondary page')
        if (this.pages.find(p => p.name == page.name)) throw new SyntaxError('This page already exists')
        if (page.action && page.buttons.length > 0) throw new SyntaxError('Cannot use action and buttons in one page')

        const buttonNamesTotal = this.pages.map(p => p.buttons.map(b => b.button.custom_id)).flat()
        if ((new Set(buttonNamesTotal)).size !== buttonNamesTotal.length)
            throw new SyntaxError('Repeating button ID between pages')

        const buttonNamesLocal = page.buttons.map(b => b.button.custom_id).flat()
        if ((new Set(buttonNamesLocal)).size !== buttonNamesLocal.length)
            throw new SyntaxError(`Repeating button ID localy in a page "${page.name}"`)

        if (!page.action)
            page.buttons.push(new Button()
                .setButton(new MessageButton()
                    .setStyle(2)
                    .setLabel('Назад')
                    .setID(`back`))
                .setAction(async menu => {
                    await menu.sendPage(page.prev.name)
                })
            )

        page.embed.setTitle(`${page.prev.embed.title}: ${page.embed.title[0].toLowerCase() + page.embed.title.slice(1)}`)

        page.buttons.forEach(b => {
            b.button.custom_id = `${page.prev.name}-${page.name}-${b.button.custom_id}`
        })

        page.buttons.forEach(b => {
            b.button.custom_id = `${this.channel.guild.id}-${b.button.custom_id}`
        })

        this.pages.push(page)

        return this
    }

    async send() {
        const page = this.pages[0]
        this.currentMessage = await this.channel.send({ embed: page.embed, buttons: page.buttons.map(b => b.button) || null } as ExtendedMessageOptions) as ExtendedMessage
        this.addListener(page)

        return this
    }

    async sendPage(name: string) {
        const page = this.pages.find(p => p.name == name)
        if (!page) throw new ReferenceError('No page found!')

        this.currentMessage = await this.currentMessage.edit({ embed: page.embed, buttons: page.buttons.map(b => b.button).length > 0 ? page.buttons.map(b => b.button) : null } as ExtendedMessageOptions) as ExtendedMessage

        if (page.action) page.action(this, page)
        if (!page.action) this.addListener(page)
        return this.currentMessage
    }

    /**@deprecated This method should not be used */
    async clearButtons() {
        this.currentMessage = await this.currentMessage.edit({ embed: this.currentMessage.embeds[0], buttons: null } as ExtendedMessageOptions) as ExtendedMessage
        return this.currentMessage
    }

    /**@deprecated This method should not be used */
    async sendEmbed(emb: MessageEmbed) {
        await this.clearButtons()
        this.currentMessage = await this.currentMessage.edit({ embed: emb }) as ExtendedMessage
        return this.currentMessage
    }

    async delete(time?: number) {
        if (this.currentMessage.deletable)
            await this.currentMessage.delete({ timeout: time })
    }

    async addListener(page: Page) {
        const filter = (button: MessageComponent) => button.clicker.user.id === this.clicker.id
        const collector = this.currentMessage.createButtonCollector(filter, { max: 1, time: 60000 })
        collector.on('end', async collected => {
            try {
                const button = collected.first();
                button ? button.defer() : (() => { throw new TimeoutError() })()

                page.buttons.find(b => b.button.custom_id == button.id).action(this, button, page)
            } catch (error) {
                if (error instanceof TimeoutError && this.currentMessage.deletable)
                    await this.currentMessage.delete()
                else
                    throw error
            }
        })
    }
}