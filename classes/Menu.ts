import { MessageButton, ExtendedMessage, ExtendedMessageOptions, MessageComponent } from 'discord-buttons'
import { Guild, MessageEmbed, TextChannel, User } from 'discord.js';
import Button from './Button';
import Toggle from './Toggle';
import Page from './Page';
import { logger } from '../utility/logger';
import OneWay from './OneWay';
class TimeoutError extends Error {
    constructor(message?, name?) {
        super(message)
        name ? this.name = name : null
    }
}

function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for (var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

export default class Menu {
    pages: Page[] = []
    currentMessage: ExtendedMessage
    clicker: User
    guild: Guild
    channel: TextChannel

    constructor(guild: Guild, channel: TextChannel, clicker: User) {
        this.guild = guild
        this.channel = channel
        this.clicker = clicker
    }

    /** Adds a page to the menu and sets it up */
    addPage(page: Page) {
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
                if (page.buttons) {
                    // Adding "Back" button if page has buttons
                    page.buttons.push(new Button()
                        .setButton(new MessageButton()
                            .setStyle(2)
                            .setLabel('Назад')
                            .setID(`back`))
                        .setAction(async button => {
                            await button.page.menu.sendPage(page.prev.name)
                        })
                    )
                    // Chaining together better button IDs and settings their page
                    page.buttons.forEach(b => {
                        b.button.custom_id = `${this.channel.guild.id}-${page.prev.name}-${page.name}-${b.button.custom_id}`
                        b.page = page
                    })
                }

                // Chaining together the title
                page.embed.title = (`${page.prev.embed.title}: ${page.embed.title[0].toLowerCase() + page.embed.title.slice(1)}`)
                page.setup = true
            }
        }
        this.pages.push(page)
        return this
    }
    /** Adds multiple pages*/
    addPages(pages: Page[]) {
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
    async send() {
        this.verifyMenu()
        const page = this.pages[0]
        this.currentMessage = await this.channel.send({ embed: page.embed, buttons: page.buttons.map(b => b.button) || null } as ExtendedMessageOptions) as ExtendedMessage
        this.addListener(page)

        return this
    }

    /** Sends the page with name `name` */
    async sendPage(name: string) {
        const page = this.pages.find(p => p.name == name)
        if (!page) throw new ReferenceError('No page found!');
        if (page.buttons) await Promise.all((page.buttons.filter(b => b instanceof Toggle && b.inited == false) as Toggle[]).map(b => b.init(b)))
        if (page.buttons) await Promise.all((page.buttons.filter(b => b instanceof OneWay && b.inited == false) as OneWay[]).map(b => b.init(b)))

        this.currentMessage = await this.currentMessage.edit({ embed: page.embed, buttons: page.buttons && page.buttons.map(b => b.button).length > 0 ? page.buttons.map(b => b.button) : null } as ExtendedMessageOptions) as ExtendedMessage

        if (page.action) page.action(page)
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

    /** Deletes the menu message 
     * @deprecated This function causes API errors, do not use
     */
    async delete(time?: number) {
        if (!this.currentMessage.deleted)
            await this.currentMessage.delete({ timeout: time })
    }

    /** Adds a listener for buttons */
    async addListener(page: Page) {
        const filter = (button: MessageComponent) => button.clicker.user.id === this.clicker.id
        const collector = this.currentMessage.createButtonCollector(filter, { max: 1, time: 60000 });
        collector.on('end', async collected => {
            try {
                const button = collected.first();
                button ? button.defer() : (() => { throw new TimeoutError() })()

                const actButton = page.buttons.find(b => b.button.custom_id == button.id)
                actButton.action(actButton as Toggle & Button)
            } catch (error) {
                if (error instanceof TimeoutError) {
                    if (this.currentMessage.deletable)
                        this.currentMessage.delete()
                            .catch(() => { })
                }
                else
                    throw error
            }
        })
    }
}