import { MessageActionRow, MessageButton, MessageComponent } from 'discord-buttons'
import { Guild, Message, MessageEmbed, TextChannel, User } from 'discord.js'

import Page from './Page'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utility/logger'
import { Button } from '../headers/classes'


/** @deprecated Use for passing objects by value */
function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj

    const temp = new obj.constructor()
    for (const key in obj)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        temp[key] = clone(obj[key])

    return temp
}

function arrayChunk(array: any[], chunkSize: number): any[][] {
    const arrayOfArrays = []

    if (array.length <= chunkSize) {
        arrayOfArrays.push(array)
    } else {
        for (let i = 0; i < array.length; i += chunkSize) {
            arrayOfArrays.push(array.slice(i, i + chunkSize))
        }
    }
    return arrayOfArrays
}

export default class Menu {
    pages: Page[] = []
    currentMessage: Message
    clicker: User
    guild: Guild
    channel: TextChannel

    constructor(guild: Guild, channel: TextChannel, clicker: User) {
        this.guild = guild
        this.channel = channel
        this.clicker = clicker
    }

    /** Adds a page to the menu and sets it up */
    addPage(page: Page): Menu {
        if (page.buttons && page.buttons.length == 0) throw new SyntaxError('Buttons array cannot be empty. Can be null or an array')
        // if (page.setup !== undefined) throw new SyntaxError('Pages "setup" value should not be set')

        page.menu = this
        if (this.pages.length == 0) {
            // First page setup
            if (!page.setup) {
                page.buttons.forEach(b => {
                    b.button.custom_id = `${this.guild.id}-${page.name}-${b.button.custom_id}`
                    b.page = page
                })
                page.setup = true
            }
        } else {
            if (!page.prev) throw new ReferenceError('No previous page defined in a secondary page')
            // Secondary page setup
            if (!page.setup) {

                // Setup "close" button
                if (!page.buttons) page.buttons = []
                page.buttons.push(new Button()
                    .setButton(new MessageButton()
                        .setStyle(4)
                        .setLabel('Закрыть')
                        .setID(`close`))
                    .setAction(async button => {
                        await page.menu.currentMessage.delete()
                        button.page.menu = null
                    })
                )
                // Adding "Back" button if page has buttons other than "close"
                if (page.buttons.length > 1) {
                    page.buttons.splice(page.buttons.length - 1, 0,
                        new Button()
                            .setButton(new MessageButton()
                                .setStyle(2)
                                .setLabel('Назад')
                                .setID(`back`))
                            .setAction(async button => {
                                await button.page.menu.sendPage(page.prev.name)
                            })
                    )
                }
                // Chaining together better button IDs and settings their page
                page.buttons.forEach(b => {
                    b.button.custom_id = `${this.channel.guild.id}-${page.prev.name}-${page.name}-${b.button.custom_id}`
                    b.page = page
                })

                // Chaining together the title
                page.embed.title = (`${page.prev.embed.title}: ${page.embed.title[0].toLowerCase() + page.embed.title.slice(1)}`)
                page.setup = true
            }
        }
        this.pages.push(page)
        return this
    }
    /** Adds multiple pages*/
    addPages(pages: Page[]): Menu {
        pages.forEach(p => {
            this.addPage(p)
        })
        return this
    }

    private verifyMenu() {
        // if (this.pages[0].buttons.length <= 0) throw new SyntaxError('First page must have buttons')
        const pageNames = this.pages.map(p => p.name)
        if (new Set(pageNames).size != pageNames.length) throw new SyntaxError('Duplicate page name')
        const buttonIDs = this.pages.map(p => p.buttons ? p.buttons.map(b => b.button.custom_id) : []).flat().filter(bid => bid != '')
        if (new Set(buttonIDs).size != buttonIDs.length) throw new SyntaxError('Duplicate button ID')
    }

    /** Sends the menu to the designated channel */
    async send(): Promise<Menu> {
        this.verifyMenu()
        const page = this.pages[0]
        this.currentMessage = await this.channel.send({ embed: page.embed, buttons: page.buttons.map(b => b.button) || null })
        this.addListener(page)

        return this
    }

    /** Sends the page with name `name` */
    async sendPage(name: string): Promise<Message> {
        const page = this.pages.find(p => p.name == name)
        if (!page) throw new ReferenceError('No page found!')
        if (page.buttons) await Promise.all(page.buttons.map(b => b.init(b)))
        // if (page.buttons) await Promise.all((page.buttons.filter(b => b instanceof OneWay && b.inited == false) as OneWay[]).map(b => b.init(b)))

        // const rows = page.buttons ? arrayChunk(page.buttons.map(b => b.button).flat(), 5).flat() as MessageActionRow[] : []
        const rows = page.buttons ? arrayChunk(page.buttons.map(b => b.button), 5).map(ch => new MessageActionRow().addComponents(...ch)) : []

        // this.currentMessage = await this.currentMessage.edit({ embed: page.embed, buttons: page.buttons && page.buttons.map(b => b.button).length > 0 ? page.buttons.map(b => b.button) : null } as ExtendedMessageOptions) as ExtendedMessage
        if (this.currentMessage)
            this.currentMessage = await this.currentMessage.edit({ embed: page.embed, components: rows })
        else
            return null

        if (page.action) page.action(page)
        this.addListener(page)

        return this.currentMessage
    }

    /**@deprecated This method should not be used */
    async clearButtons(): Promise<Message> {
        this.currentMessage = await this.currentMessage.edit({ embed: this.currentMessage.embeds[0] }, null)
        return this.currentMessage
    }

    /**@deprecated This method should not be used */
    async sendEmbed(emb: MessageEmbed): Promise<Message> {
        await this.clearButtons()
        this.currentMessage = await this.currentMessage.edit({ embed: emb })
        return this.currentMessage
    }

    /** Deletes the menu message 
     * @deprecated This function causes API errors, do not use
     */
    async delete(time?: number): Promise<void> {
        if (!this.currentMessage.deleted)
            await this.currentMessage.delete({ timeout: time })
    }

    /** Adds a listener for buttons */
    async addListener(page: Page): Promise<void> {
        const filter = (button: MessageComponent) => button.clicker.user.id === this.clicker.id
        const collector = this.currentMessage.createButtonCollector(filter, { max: 1, time: 10000 })
        collector.on('end', async (collected, reason) => {
            try {
                const button = collected.first()
                button ? await button.reply.defer(false) : (() => { throw 'timeout' })()
                const actButton = page.buttons.find(b => b.button.custom_id == button.id)
                await actButton.action(actButton)
            } catch (error) {
                if (error === 'timeout')
                    this.currentMessage.delete()
                else
                    throw error

            }
        })
    }
}