import { DlCard } from '..'
import { Meta, StoryObj } from '@storybook/vue3'

const args = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
    title: 'Lorem ipsum',
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

type Story = StoryObj<typeof DlCard>

const meta: Meta<typeof DlCard> = {
    title: 'Library/Components/DlCard',
    component: DlCard
}

export default meta

export const ImageCard: Story = {
    args: {
        image: {
            src: 'https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1'
        },
        ...args
    }
}

export const IconCard: Story = {
    args: {
        icon: {
            src: 'icon-dl-alert-filled',
            color: 'red'
        },
        ...args
    }
}

export const InteractiveCard: Story = {
    args: {
        text: 'Some text',
        image: {
            src: 'https://www.shutterstock.com/image-photo/ripe-orange-isolated-on-white-260nw-606022676.jpg',
            styles: 'width: 200px; height: 112px',
            link: {
                icon: 'icon-dl-link',
                color: 'black',
                size: '12px',
                href: 'https://dataloop.ai/'
            }
        },
        title: 'Lorem ipsum',
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
        ],
        interactive: true,
        zoom: true,
        cardId: 2,
        tags: [
            {
                label: 'A',
                color: '#FFBBFF',
                textColor: 'black'
            },
            {
                label: 'Lemon',
                color: '#7000FF',
                textColor: 'black'
            },
            {
                label: 'B',
                color: '#FFDA3A',
                textColor: 'black'
            },
            {
                label: 'D',
                color: '#00A0FF',
                textColor: 'black'
            },
            {
                label: 'X',
                color: '#AADC3A',
                textColor: 'black'
            }
        ],
        hints: [
            {
                icon: 'icon-dl-related-filled',
                color: ''
            },
            {
                icon: 'icon-dl-alert-filled',
                color: 'red'
            }
        ],
        description: 'descriptiononono',
        indicatorColor: 'dl-color-negative'
    }
}
