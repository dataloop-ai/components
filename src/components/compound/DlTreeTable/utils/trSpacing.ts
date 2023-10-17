const setTrSpacing = (item: Record<string, any>) => {
    let paddingLeft = 10

    if (item.children) {
        paddingLeft = item.level * 16
    } else {
        paddingLeft = item.level * 16 + 16
    }

    return `padding-left: ${paddingLeft}px;`
}

const setTrPadding = (level = 1, hasChildren = false, colIndex = 0) => {
    let paddingLeft = 0

    if (colIndex == 0) {
        paddingLeft = (level - 1) * 16
        return paddingLeft
    }

    return paddingLeft
}

export { setTrSpacing, setTrPadding }
