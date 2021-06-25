import { MessageButton, ExtendedMessage, ExtendedMessageOptions, MessageComponent } from 'discord-buttons'
import { MessageEmbed, TextChannel, User } from 'discord.js';
import { logger } from '../utility/logger';
import Button from './Button';
import Toggle from './Toggle';
import Page from './Page';
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
    public pages: Page[] = []
    public currentMessage: ExtendedMessage
    public clicker: User
    public channel: TextChannel

    constructor(pages: Page[], clicker: User, channel: TextChannel) {
        // Ground-zero checks for pages validity
        if (pages[0].buttons.length <= 0) throw new SyntaxError('First page must have buttons')
        const pageNames = pages.map(p => p.name)
        if (new Set(pageNames).size != pageNames.length) throw new SyntaxError('Duplicate page name')
        const buttonIDs = pages.map(p => p.buttons ? p.buttons.map(b => b.button.custom_id) : []).flat().filter(bid => bid != '')
        logger.debug(buttonIDs)
        if (new Set(buttonIDs).size != buttonIDs.length) throw new SyntaxError('Duplicate button ID')

        pages.slice(1).forEach(p => {
            if (!p.prev) throw new ReferenceError('No previous page defined in a secondary page')
            if (p.action && p.buttons && p.buttons.length > 0) throw new SyntaxError('Cannot use action and buttons in one page')
        })

        this.channel = channel
        this.clicker = clicker
        // Removing the connection between original values and object's 
        // pages.forEach(p => {
        //     // this.pages.push(JSON.parse(JSON.stringify(p)))
        //     this.pages.push(clone(p))
        // })
        this.pages = pages

        // Settings proper ID to buttons on main page
        const firstPage = this.pages[0]
        if (!firstPage.setup) {
            firstPage.buttons.forEach(b => {
                b.button.custom_id = `${channel.guild.id}-${firstPage.name}-${b.button.custom_id}`
            })
            firstPage.setup = true
        }

        // Modifying the pages
        this.pages.slice(1).forEach(p => {
            if (!p.setup) {
                // Adding "Back" button to all pages with buttons
                if (p.buttons && p.buttons.length > 0)
                    p.buttons.push(new Button()
                        .setButton(new MessageButton()
                            .setStyle(2)
                            .setLabel('Назад')
                            .setID(`back`))
                        .setAction(async menu => {
                            await menu.sendPage(p.prev.name)
                        })
                    )

                // Chaining together the title
                p.embed.title = (`${p.prev.embed.title}: ${p.embed.title[0].toLowerCase() + p.embed.title.slice(1)}`)

                // Chaining together better button IDs
                if (p.buttons)
                    p.buttons.forEach(b => {
                        b.button.custom_id = `${this.channel.guild.id}-${p.prev.name}-${p.name}-${b.button.custom_id}`
                    })
                p.setup = true
            }
        })
    }

    /** Sends the menu to the designated channel */
    async send() {
        const page = this.pages[0]
        this.currentMessage = await this.channel.send({ embed: page.embed, buttons: page.buttons.map(b => b.button) || null } as ExtendedMessageOptions) as ExtendedMessage
        this.addListener(page)

        return this
    }

    /** Sends the page with name `name` */
    async sendPage(name: string) {
        const page = this.pages.find(p => p.name == name)
        if (!page) throw new ReferenceError('No page found!')

        this.currentMessage = await this.currentMessage.edit({ embed: page.embed, buttons: page.buttons && page.buttons.map(b => b.button).length > 0 ? page.buttons.map(b => b.button) : null } as ExtendedMessageOptions) as ExtendedMessage

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
        const toggleButtons = page.buttons.filter(b => b instanceof Toggle) as Toggle[]
        toggleButtons ? toggleButtons.forEach(b => b.start(this, null, page)) : null
        collector.on('end', async collected => {
            try {
                const button = collected.first();
                button ? button.defer() : (() => { throw new TimeoutError() })()

                page.buttons.find(b => b.button.custom_id == button.id).action(this, button, page)
            } catch (error) {
                if (error instanceof TimeoutError) {
                    if (this.currentMessage.deletable)
                        await this.currentMessage.delete()
                }
                else
                    throw error
            }
        })
    }
}