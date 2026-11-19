import { isVue2 } from 'vue-demi'

export default function (
    props: any,
    content: any[],
    create: Function,
    tableAttrs?: Record<string, any>
) {
    const attrs = tableAttrs || {}
    return create('div', props, [
        create(
            'table',
            isVue2
                ? { class: 'dl-table', attrs }
                : { class: 'dl-table', ...attrs },
            content
        )
    ])
}
