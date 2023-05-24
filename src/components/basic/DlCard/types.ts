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

export type IconLink = {
    icon: string
    color: string
    backgroundColor: string
    size: string
    link: string
    circle: {
        size: string
        color: string
    }
}

export type ChipsItemsType = {
    label: string
    color: string
    textColor: string
}

export type InnerIconsType = {
    icon: string
    color: string
}

export type ShopifyTitleType = {
    label: string
    count: number
}
