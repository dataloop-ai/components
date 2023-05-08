const setTrSpacing = (item: Record<string, any>) => {
    let paddingLeft = 10

    if (item.level > 1) {
        paddingLeft = (item.level - 1) * 16
    }

    return `padding-left: ${paddingLeft}px;`
}

export { setTrSpacing }
