import { RecordStringAny } from '../types'

export function getRowKey(rowKey: string | Function) {
    return typeof rowKey === 'function'
        ? rowKey
        : (row: RecordStringAny) => row[rowKey as string]
}
