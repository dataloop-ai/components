const setTrSpacing = (item: Record<string, any>) => {
    let paddingLeft = 10

    if (item.children) {
        paddingLeft = item.level * 16
    } else {
        paddingLeft = item.level * 16 + 16
    }

    return `padding-left: ${paddingLeft}px;`
}

export { setTrSpacing }
