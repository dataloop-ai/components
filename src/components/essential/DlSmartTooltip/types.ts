export type ImageItem = {
    src: string
    styles?: string
    alt?: string
}

export type IconItem = {
    src: string
    styles?: string
    size?: string
    color?: string
}

export type LinkItem = {
    title: string
    href: string
    icon?: string
    newtab?: boolean
    external?: boolean
}
