import { MessageButton, MessageComponent } from 'discord-buttons'
import { logger } from '../utility/logger';
import Menu from './Menu';
import Page from './Page'

export default class Toggle {
    button: MessageButton
    state: boolean = true
    page: Page
    inited = false
    action: (button: Toggle) => void
    private on: (button: Toggle) => void
    private off: (button: Toggle) => void
    init: (button: Toggle) => Promise<void>

    constructor() {
        this.action = () => { }
    }

    private showON = async () => {
        const page = this.page.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(3)
        await this.page.menu.sendPage(page.name)
    }
    private showOFF = async () => {
        const page = this.page.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(4)
        await this.page.menu.sendPage(page.name)
    }

    setButton(button: MessageButton) {
        this.button = button
        return this
    }

    setOn(action: (button: Toggle) => void) {
        this.on = (button: Toggle) => {
            action.call(this, this)
            this.showON.call(this)
            this.state = !this.state
            this.action = this.off
            return false
        }
        return this
    }

    setOff(action: (button: Toggle) => void) {
        this.off = (button: Toggle) => {
            action.call(this, this)
            this.showOFF.call(this)
            this.state = !this.state
            this.action = this.on
            return false
        }
        return this
    }

    setState(state: boolean) {
        switch (state) {
            case true:
                this.button.setStyle(3)
                this.action = this.off
                break
            case false:
                this.button.setStyle(4)
                this.action = this.on
                break
        }
        this.inited = true
    }

    setInit(initFoo: (button: Toggle) => Promise<void>) {
        this.init = initFoo
        return this
    }
}