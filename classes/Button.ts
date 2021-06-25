import { MessageButton, MessageComponent } from 'discord-buttons'
import Menu from './Menu';
import Page from './Page'

export default class Button {
    public button: MessageButton
    public action: (menu: Menu, button: MessageComponent, currentPage: Page) => void

    constructor() { }

    setButton(button: MessageButton) {
        this.button = button
        return this
    }
    setAction(action: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void) {
        this.action = action
        return this
    }
}

