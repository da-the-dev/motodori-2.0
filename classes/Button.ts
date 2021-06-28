import { MessageButton } from 'discord-buttons'
import Page from './Page'

export default class Button {
    page: Page
    button: MessageButton
    action: (button: Button) => void

    setButton(button: MessageButton): Button {
        this.button = button
        return this
    }
    setAction(action: (button: Button) => void): Button {
        this.action = action
        return this
    }
}

