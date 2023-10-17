export function getContainerClass(
    separator: string,
    bordered: boolean,
    dense: boolean,
    loading: boolean
) {
    let classNames = `dl-table__container dl-table--${separator}-separator column no-wrap dl-table--no-wrap`

    if (bordered) {
        classNames = classNames + ' dl-table--bordered'
    }

    if (dense) {
        classNames = classNames + ' dl-table--dense'
    }

    if (loading) {
        classNames = classNames + ' dl-table--loading'
    }

    return classNames
}
