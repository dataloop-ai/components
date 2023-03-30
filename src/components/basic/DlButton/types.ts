export enum ButtonState {
    Active = 'ACTIVE',
    Hover = 'HOVER',
    Pressed = 'PRESSED',
    Disabled = 'DISABLED'
}

export enum ButtonPart {
    Text = 'TEXT',
    Background = 'BACKGROUND',
    Border = 'BORDER'
}

export type ButtonColors = Record<ButtonState, Record<ButtonPart, string>>
