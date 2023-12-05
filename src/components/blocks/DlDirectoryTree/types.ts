export type DlDirectoryTreeItem = {
    identifier: string
    displayLabel: string
    children?: DlDirectoryTreeItem[]
    root?: boolean
}
