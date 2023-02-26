export const textTransform = (text: string) =>
    text
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) =>
            letter.toUpperCase()
        )
