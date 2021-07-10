// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger } from '../utility/logger'
import BaseButton from './BaseButton'

export default class Toggle extends BaseButton {
    private isOn: (button: this) => void
    private isOff: (button: this) => void
    state = true

    constructor() {
        super()
        this.action = () => { }
    }

    private showON = async () => {
        this.button.setStyle('green')
        // const page = this.page.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        // page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(3)
        await this.page.menu.sendPage(this.page.name)
    }
    private showOFF = async () => {
        this.button.setStyle('red')
        // const page = this.page.menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
        // page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setStyle(4)
        await this.page.menu.sendPage(this.page.name)
    }

    setOn(action: (button: this) => void): this {
        this.isOn = (button: this) => {
            action.call(null, this)
            this.showON.call(null)
            this.state = !this.state
            this.action = this.isOff
            return false
        }
        return this
    }

    setOff(action: (button: this) => void): this {
        this.isOff = (button: this) => {
            action.call(null, this)
            this.showOFF.call(null)
            this.state = !this.state
            this.action = this.isOn
            return false
        }
        return this
    }

    setState(state: boolean): this {
        switch (state) {
            case true:
                this.button.setStyle(3)
                this.action = this.isOff
                break
            case false:
                this.button.setStyle(4)
                this.action = this.isOn
                break
        }
        return this
    }
}