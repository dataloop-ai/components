import { DlEmptyState } from '..'

export default {
    title: 'Library/Components/DlEmptyState',
    component: DlEmptyState,
    argTypes: {
        bgImage: {
            name: 'bgImage',
            description: 'The background Image of the main container'
        },
        bgSize: {
            name: 'bgSize',
            description: 'The background image size of the main container'
        },
        title: {
            name: 'title',
            description: 'The title of the empty state'
        },
        titleColor: {
            name: 'titleColor',
            description: 'The title color prop'
        },
        titleClass: {
            name: 'titleClass',
            description: 'The class of title element'
        },
        subtitle: {
            name: 'subtitle',
            description: 'The subtitle of the empty state'
        },
        subtitleColor: {
            name: 'subtitleColor',
            description: 'The sub title color prop'
        },
        subtitleClass: {
            name: 'titleClass',
            description: 'The class of subtitle element'
        },
        icon: {
            name: 'icon',
            description: 'The icon of the empty state'
        },
        iconColor: {
            name: 'iconColor',
            description: 'The icon color prop'
        },
        iconClass: {
            name: 'iconClass',
            description: 'The class of icon element'
        },
        info: {
            name: 'info',
            description: 'The info of the empty state'
        },
        infoColor: {
            name: 'infoColor',
            description: 'The info color prop'
        },
        infoClass: {
            name: 'infoClass',
            description: 'The class of info element'
        }
    }
}

const Template = (args) => ({
    components: { DlEmptyState },
    setup() {
        return { args }
    },
    template: `
    <div style="padding: 50px">
        <DlEmptyState v-bind="args"> {{args.default}} </DlEmptyState>
    </div>
   `
})

export const Preview = Template.bind({})
Preview.args = {
    bgSize: '240px',
    bgImage: ''
}
