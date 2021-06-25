import { MessageComponent, MessageButton } from 'discord-buttons'
import Menu from './Menu';
import Page from './Page'
import Button from './Button';
import { logger } from '../utility/logger';

export default class OneWay extends Button {
    public state: boolean
    constructor() { super() }

    setAction(action: (menu: Menu, button?: MessageComponent, currentPage?: Page) => void) {
        const toggle = async (menu: Menu) => {
            const page = menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
            logger.debug(page.name)
            page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setDisabled(true)
            await menu.sendPage(page.name)
        }
        this.action = (menu: Menu, button: MessageComponent, currentPage: Page) => {
            action.call(this, [menu, button, currentPage])
            toggle.call(this, menu)
        }
        return this
    }

    setButton(button: MessageButton) {
        super.setButton(button)
        return this
    }
    init(initFoo: (button: OneWay) => void) {
        initFoo(this)
        return this
    }
}

