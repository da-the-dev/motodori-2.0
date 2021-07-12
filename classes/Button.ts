import BaseButton from '../classes/BaseButton'

export default class Button extends BaseButton {
    setAction(action: (button: this) => void): this {
        this.action = action
        return this
    }
}