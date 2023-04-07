import { DlSmartTooltip } from '../'
import { colors } from '../assets/globalsKeys'
import { positions } from './DlMenu.stories'

export default {
    title: 'Library/Components/DlSmartTooltip',
    component: DlSmartTooltip,
    argTypes: {
        text: {
            name: 'text',
            type: { name: 'string', required: false },
            description: 'The tooltip text'
        },
        icon: {
            name: 'icon',
            type: { type: 'object', required: false },
            description: 'The tooltip icon'
        },
        image: {
            name: 'image',
            type: { type: 'object', required: false },
            description: 'The tooltip image',
            defaultValue: {
                src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
            }
        },
        delay: {
            name: 'delay',
            type: { type: 'number', required: false },
            description: 'The tooltip delay'
        },
        title: {
            name: 'title',
            type: { name: 'string', required: false },
            description: 'The tooltip title',
            defaultValue: 'Lorem ipsum'
        },
        keyboardShortcut: {
            name: 'keyboardShortcut',
            type: { name: 'string', required: false },
            description: 'The tooltip keyboard shortcut',
            defaultValue: 'Shift + E'
        },
        links: {
            name: 'links',
            type: { name: 'array', required: false },
            description: 'The tooltip keyboard links',
            defaultValue: [
                {
                    icon: 'icon-dl-list-view',
                    href: 'https://www.google.md/?hl=ru',
                    title: 'Lorem',
                    newtab: true,
                    external: true
                },
                {
                    href: '#test',
                    title: 'Developers',
                    icon: 'icon-dl-code'
                }
            ]
        },
        anchor: {
            name: 'anchor',
            type: { name: 'string', required: false },
            defaultValue: 'bottom middle',
            description:
                'Two values setting the starting position or anchor point of the Tooltip relative to its target',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'bottom middle' }
            },
            control: {
                type: 'select',
                options: positions
            }
        },
        self: {
            name: 'self',
            type: { name: 'string', required: false },
            defaultValue: 'top middle',
            description:
                "Two values setting the Tooltip's own position relative to its target",
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'top middle' }
            },
            control: {
                type: 'select',
                options: positions
            }
        },
        offset: {
            name: 'offset',
            control: 'array',
            defaultValue: [9, 9],
            description:
                'An array of two numbers to offset the Tooltip horizontally and vertically in pixels'
        }
    }
}

const Template = (args) => ({
    components: { DlSmartTooltip },
    setup() {
        return { args }
    },
    template: `
        <div style="padding: 50px">
            <div
                style="
                display: flex;
                flex-direction: column;
                gap: 1em;
                justify-content: center;
                "
            >
                <div style="border: 1px solid black">
                    <dl-smart-tooltip anchor="top middle" v-bind="args"/>
                    Show smart tooltip
                </div>
            </div>
        </div>
   `
})
export const Preview = Template.bind({})
Preview.args = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
    image: {
        src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
    },
    delay: 2000,
    title: 'Lorem ipsum',
    keyboardShortcut: 'Shift + E',
    links: [
        {
            icon: 'icon-dl-list-view',
            href: 'https://www.google.md/?hl=ru',
            title: 'Lorem',
            newtab: true,
            external: true
        },
        {
            href: '#test',
            title: 'Developers',
            icon: 'icon-dl-code'
        }
    ]
}
