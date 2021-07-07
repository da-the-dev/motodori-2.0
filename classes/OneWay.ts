import Menu from './Menu'
import Button from './Button'
export default class OneWay extends Button {
    state: boolean
    constructor() { super() }

    setAction(action: (button: this) => void): this {
        const toggle = async (menu: Menu) => {
            const page = menu.pages.find(p => p.buttons && p.buttons.find(b => b.button.custom_id == this.button.custom_id))
            page.buttons.find(b => b.button.custom_id == this.button.custom_id).button.setDisabled(true)
            await menu.sendPage(page.name)
        }
        this.action = (button: Button) => {
            action.call(this, this)
            toggle.call(this, this.page.menu)
        }
        return this
    }

    setState(state: boolean): this {
        this.state = state
        if (this.state == true)
            this.button.setDisabled(false)
        else
            this.button.setDisabled(true)
        return this
    }
}

