export default function (props: any, content: any[], create: Function) {
    return create('div', props, [
        create('table', { class: 'dl-table' }, content)
    ])
}
