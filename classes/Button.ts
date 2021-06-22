import { MessageButton, MessageComponent } from 'discord-buttons'
import { Menu } from './Menu';
import Page from './Page';

export default class Button {
    private _button: MessageButton
    private _action: (menu: Menu, button: MessageComponent, currentPage: Page) => void

    constructor() { }

    setButton(button: MessageButton) {
        this._button = button
        return this
    }
    setAction(action: (menu: Menu, button: MessageComponent, currentPage: Page) => void) {
        this._action = action
        return this
    }


    public get button() {
        return this._button
    }
    public get action() {
        return this._action
    }
}

