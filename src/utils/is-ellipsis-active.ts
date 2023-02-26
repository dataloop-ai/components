export const isEllipsisActive = (e: Element) => {
    return (e as HTMLElement).offsetWidth < e.scrollWidth
}
