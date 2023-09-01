import { DlBarChart, DlWidget, DlButton, DlIcon } from '../components'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlWidget>

const meta: Meta<typeof DlWidget> = {
    title: 'Library/Components/DlWidget',
    component: DlWidget,
    argTypes: {
        isEmpty: {
            name: 'isEmpty',
            type: { name: 'boolean', required: false },
            description: 'Is empty state flag.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            },
            control: {
                type: 'boolean'
            }
        },
        emptyStateProps: {
            name: 'emptyStateProps',
            type: { name: 'object', required: false },
            defaultValue: null,
            description:
                'The empty state props object, isEmpty is required to be true.',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: {} }
            }
        },
        draggable: {
            name: 'draggable',
            type: { name: 'boolean', required: false },
            description: 'Is the widget is draggable.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            },
            control: {
                type: 'boolean'
            }
        }
    }
}

export default meta

const data = {
    labels: Array.from({ length: 20 }, (_, i) => `${i}`),
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        }
    ]
}

export const Template: Story = {
    render: (args, { argTypes }) => {
        return {
            components: {
                DlWidget,
                DlIcon,
                DlBarChart
            },
            setup() {
                return {
                    data
                }
            },
            template: `
                <div>
                    <dl-widget>
                            <template #header>
                                <span>Widget with menu icons</span>
                                <span style="font-size: 12px; color: var(--dl-color-medium)">Subtitle</span>
                            </template>
                            <template #content>
                                <dl-bar-chart
                                    :data="data"
                                    :items-in-view="8"
                                />
                            </template>
                            <template #menu>
                                <div style="display: flex; gap: 15px; padding: 0 10px">
                                    <dl-icon
                                        size="m"
                                        icon="icon-dl-settings"
                                    />
                                    <dl-icon
                                        size="m"
                                        icon="icon-dl-download"
                                    />
                                </div>
                            </template>
                    </dl-widget>
                </div>
            `
        }
    }
}

// ==============================

export const EmptyStateTemplate: Story = {
    render: (args, { argTypes }) => {
        return {
            components: {
                DlWidget,
                DlButton,
                DlBarChart
            },
            setup() {
                return {
                    data
                }
            },
            template: `
                <div>
                    <dl-widget
                            is-empty
                            :empty-state-props="{
                                style: 'min-height: 350px;',
                                title: 'Lorem ipsum',
                                subtitle:
                                    'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                                info: 'To learn more about this analytics, read our documentation.',
                                responsive: false
                            }"
                        >
                            <template #header>
                                <span>Empty state widget</span>
                            </template>
                            <template #links="">
                                <div style="display: flex; gap: 5px; padding: 0 20px">
                                    <dl-button
                                        padding="0px"
                                        icon="icon-dl-sdk-documentation"
                                        flat
                                        uppercase
                                        label="SDK"
                                    />
                                    <div class="break" />
                                    <dl-button
                                        padding="0px"
                                        icon="icon-dl-file"
                                        flat
                                        label="Documentation"
                                    />
                                    <div class="break" />
                                    <dl-button
                                        padding="0px"
                                        icon="icon-dl-youtube"
                                        flat
                                        label="Video"
                                    />
                                </div>
                            </template>
                    </dl-widget>
                </div>
            `
        }
    }
}
