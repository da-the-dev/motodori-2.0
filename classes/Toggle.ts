import { MessageButton, MessageComponent } from 'discord-buttons'
import Menu from './Menu';
import Page from './Page'

export default class Toggle {
    public button: MessageButton
    public state: boolean = true
    public menu: Menu
    public action: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void
    private on: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void
    private off: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void

    constructor() { }

    private showON = async () => {
        const page = this.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(3)
        await this.menu.sendPage(page.name)
    }
    private showOFF = async () => {
        const page = this.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(4)
        await this.menu.sendPage(page.name)
    }

    setButton(button: MessageButton) {
        this.button = button
        return this
    }

    setOn(action: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void) {
        this.on = (menu: Menu, button?: MessageComponent, currentPage?: Page) => {
            action.call(this, [menu, button, currentPage])
            this.showON.call(this)
            this.state = !this.state
            this.action = this.off
            return false
        }
        return this
    }

    setOff(action: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void) {
        this.off = (menu: Menu, button?: MessageComponent, currentPage?: Page) => {
            action.call(this, [menu, button, currentPage])
            this.showOFF.call(this)
            this.state = !this.state
            this.action = this.on
            return false
        }
        return this
    }

    init(initFoo: (button: Toggle) => void) {
        initFoo(this)
        return this
    }
    start(menu: Menu, button?: MessageComponent, currentPage?: Page) {
        if (!this.on) throw new SyntaxError('No "On" action set')
        if (!this.off) throw new SyntaxError('No "Off" action set')
        this.menu = menu
        this.action = this.state ? this.off : this.on
    }
}