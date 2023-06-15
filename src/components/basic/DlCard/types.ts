export type DlCardTagType = {
    label: string
    color?: string
    textColor?: string
}

export type DlCardImageType = {
    src: string
    styles?: string
    alt?: string
    link?: {
        href: string
        icon: string
        color?: string
        backgroundColor?: string
        size?: string
    }
}

export type DlCardHintType = {
    icon: string
    color?: string
}

export type DlCardLinkType = {
    title: string
    href: string
    icon?: string
    newtab?: boolean
    external?: boolean
}
