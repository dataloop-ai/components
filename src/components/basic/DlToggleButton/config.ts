const generalStyles = {
    padding: '7px 10px',
    height: '28px',
    fontSize: 'var(--dl-font-size-body)',
    borderRadius: '0'
}

export const ButtonsStyles = Object.freeze({
    nonActiveStyles: {
        ...generalStyles,
        color: 'var(--dl-color-darker)',
        borderColor: 'var(--dl-color-separator)',
        background: 'var(--dl-color-bg)'
    },
    activeStyles: {
        ...generalStyles,
        color: 'var(--dl-color-secondary)',
        borderColor: 'var(--dl-color-secondary)',
        background: 'var(--dl-color-secondary-opacity)'
    },
    hoverStyles: {
        ...generalStyles,
        color: 'var(--dl-color-hover)',
        borderColor: 'var(--dl-color-hover)',
        background: 'var(--dl-color-bg)'
    }
})
