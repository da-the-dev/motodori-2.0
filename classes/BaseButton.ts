import { MessageButton } from 'discord-buttons'
import Page from './Page'

export default class BaseButton {
    page: Page
    button: MessageButton
    action: (button: this) => void | Promise<void>
    init: (button: this) => void

    constructor() {
        this.init = () => { }
    }

    setInit(init: (button: this) => void): this {
        this.init = init
        return this
    }
    setButton(button: MessageButton): this {
        this.button = button
        return this
    }
}