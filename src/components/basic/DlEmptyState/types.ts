export type Props = {
    bgImage?: string
    bgSize?: string
    title?: string
    titleColor?: string
    titleSize?: string
    subtitle?: string
    subtitleSize?: string
    subtitleColor?: string
    info?: string
    infoColor?: string
    infoSize?: string
    icon?: string
    iconSize?: string
    iconColor?: string
    responsive?: boolean
    align: 'center' | 'left'
}

export type EmptyStateSlots = ['cta', 'links']
