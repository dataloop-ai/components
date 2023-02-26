import { DlProgressChart } from '..'

export default {
    title: 'Library/Components/DlProgressChart',
    component: DlProgressChart,
    argTypes: {
        options: {
            control: 'array',
            description:
                'An array of objects containing all the items to be shown in the chart',
            required: true
        },
        width: {
            name: 'width',
            type: { name: 'string', required: false },
            defaultValue: '100%',
            description: 'The progress chart width',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '100%' }
            }
        },
        textColor: {
            name: 'textColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-darker',
            description: 'The color of the text',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-darker' }
            }
        },
        counterColor: {
            name: 'counterColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            description: 'The color of the counter',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlProgressChart },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
      <DlProgressChart v-bind="args" />
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    width: '500px',
    options: [
        {
            name: 'Java',
            value: 313,
            color: '#b3d4fc',
            link: 'https://www.java.com/en/'
        },
        {
            name: 'C++',
            value: 94,
            color: 'rgb(140 86 75)'
        },
        {
            name: 'C#',
            value: 108,
            color: 'rgb(148 103 189)'
        },
        {
            name: 'PHP',
            value: 124,
            color: 'rgb(42 160 43)',
            link: 'https://www.php.net/'
        },
        {
            name: 'JavaScript',
            value: 113,
            color: 'rgb(214 40 39)',
            link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
        },
        {
            name: 'Python',
            value: 248,
            color: 'rgb(255 127 14)',
            link: 'https://www.python.org/'
        }
    ]
}
