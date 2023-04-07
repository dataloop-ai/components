<template>
    <div style="width: 90%; height: 100%">
        <DlLayout
            :navbar-left-items="navbarLeftItems"
            :left-items="leftItems"
            :right-items="rightItems"
        >
            <template #navbar-center-content>
                <div style="display: flex; align-items: center">
                    <div
                        style="
                            background-color: var(--dl-color-fill-secondary);
                            border-radius: 2px;
                        "
                    >
                        <dl-button flat>
                            <dl-icon
                                size="16px"
                                icon="icon-dl-undo"
                                color="secondary"
                            />
                        </dl-button>
                        <dl-button flat>
                            <dl-icon
                                size="16px"
                                icon="icon-dl-redo"
                                color="secondary"
                            />
                        </dl-button>
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-description"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-infokeyboard"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-keyboard"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-adjustment"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-settings"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-pdf"
                        />
                    </div>
                </div>
            </template>
            <template #navbar-right-content>
                <div style="display: flex; align-items: center">
                    <dl-button flat>
                        <dl-icon
                            size="16px"
                            icon="icon-dl-light-theme"
                            color="dl-color-warning"
                        />
                    </dl-button>
                    <dl-button flat>
                        <dl-icon
                            size="16px"
                            icon="icon-dl-dark-theme"
                            color="dl-color-warning"
                        />
                    </dl-button>
                    <dl-button
                        flat
                        color="secondary"
                        icon="icon-dl-question"
                    />
                    <dl-button
                        flat
                        color="secondary"
                    >
                        <dl-icon
                            size="16px"
                            icon="icon-dl-notification"
                        />
                    </dl-button>
                    <dl-button
                        flat
                        color="secondary"
                        icon="icon-dl-cloud-server"
                    />
                    <dl-button
                        flat
                        color="secondary"
                        icon="icon-dl-magic"
                    />
                </div>
            </template>
            <template #left-side>
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        text-align: center;
                        color: white;
                    "
                >
                    <div>Custom slot</div>
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                </div>
            </template>
            <template #right-side>
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        text-align: center;
                        color: white;
                    "
                >
                    <div>Custom slot</div>
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                </div>
            </template>
            <template #default>
                <div
                    class="flex items-center"
                    style="margin: 20px"
                >
                    <ul>
                        <li>
                            You need to develop the layouts as you can see here
                            with option to enter different kinds of component in
                            the future
                        </li>
                        <li>this layout need to be responsive,</li>
                        <li>
                            Our components should be able to be applied to this
                            layout
                        </li>
                        <li>its would be our design QA</li>
                        <li>
                            We will explain where and how to apply the
                            components
                        </li>
                        <li>
                            After we apply the components, we could simulate the
                            behavior and see how it works
                        </li>
                    </ul>
                </div>
            </template>
            <template #layout-footer>
                <div
                    class="grid grid-cols-3"
                    style="width: 100%; height: 100%"
                >
                    <div class="flex items-center">
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-zoom-out"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-zoom-in"
                        />
                        <div>100%</div>
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-attribute"
                        />
                    </div>
                    <div class="flex items-center justify-center">
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-left-chevron"
                        />
                        <div>1/2 items</div>
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-right-chevron"
                        />
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-thumbnail"
                        />
                    </div>
                    <div
                        class="flex items-center justify-end"
                        style="margin-right: 20px"
                    >
                        <dl-button
                            flat
                            color="secondary"
                            icon="icon-dl-save-filled"
                        />
                        <dl-button
                            outlined
                            color="secondary"
                        >
                            Discard
                        </dl-button>
                        <dl-button
                            style="margin-left: 10px"
                            outlined
                            color="secondary"
                        >
                            Complete
                        </dl-button>
                    </div>
                </div>
            </template>
        </DlLayout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlLayout from '../components/essential/DlLayout/DlLayout.vue'
import { LayoutVerticalItems } from '../components/essential/DlLayout/types/VerticalItems'
import DlButton from '../components/basic/DlButton/DlButton.vue'
import DlIcon from '../components/essential/DlIcon/DlIcon.vue'
import { HorizontalItems } from '../components/essential/DlLayout/types/HorizontalItems'

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlLayout,
        DlButton,
        DlIcon
    },
    setup() {
        const navbarLeftItems = ref<HorizontalItems[]>([
            {
                title: 'Dataloop Ai',
                icon: 'icon-dl-organization',
                options: [
                    {
                        label: 'Organization',
                        value: 'comp'
                    },
                    {
                        label: 'Structure',
                        value: 'struct'
                    },
                    {
                        label: 'Components',
                        value: 'comp'
                    }
                ]
            },
            {
                title: 'Project Name',
                icon: 'icon-dl-project-filled',
                options: [
                    {
                        label: 'Organization',
                        value: 'comp'
                    },
                    {
                        label: 'Structure',
                        value: 'struct'
                    },
                    {
                        label: 'Components',
                        value: 'comp'
                    }
                ]
            },
            {
                title: 'Task',
                icon: 'icon-dl-task',
                options: [
                    {
                        label: 'Organization',
                        value: 'comp'
                    },
                    {
                        label: 'Structure',
                        value: 'struct'
                    },
                    {
                        label: 'Components',
                        value: 'comp'
                    }
                ]
            }
        ])
        const rightItems = ref<LayoutVerticalItems[]>([
            {
                id: 1,
                icon: 'icon-dl-dashboard',
                link: '#person',
                title: 'Right Dashboard',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 2,
                icon: 'icon-dl-project-filled',
                link: '#person',
                title: 'Active Right',
                subtitle: 'lorem ipsum dolor 123',
                fontSize: '16px'
            },
            {
                id: 3,
                icon: 'icon-dl-overview',
                link: '#finance',
                title: 'Overview Right',
                fontSize: '14px'
            },
            {
                id: 4,
                icon: 'icon-dl-data-management-filled',
                link: '#project_overview',
                title: 'Data Management',
                fontSize: '14px',
                data: [
                    {
                        id: 1,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 2,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 3,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    }
                ]
            },
            {
                id: 5,
                icon: 'icon-dl-pipeline-filled',
                link: '#project_overview',
                title: 'Pipelines',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 6,
                icon: 'icon-dl-workflows',
                link: '#project_overview',
                title: 'Workflow',
                fontSize: '14px'
            },
            {
                id: 7,
                icon: 'icon-dl-faas',
                link: '#project_overview',
                title: 'Applications (FaaS)',
                fontSize: '14px',
                data: [
                    {
                        id: 1,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 2,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 3,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    }
                ]
            }
        ])
        const leftItems = ref<LayoutVerticalItems[]>([
            {
                id: 1,
                icon: 'icon-dl-dashboard',
                link: '#person',
                title: 'My Dashboard',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 2,
                icon: 'icon-dl-project-filled',
                link: '#person',
                title: 'Active Project',
                subtitle: 'lorem ipsum dolor 123',
                fontSize: '16px'
            },
            {
                id: 3,
                icon: 'icon-dl-overview',
                link: '#finance',
                title: 'Project Overview',
                fontSize: '14px'
            },
            {
                id: 4,
                icon: 'icon-dl-data-management-filled',
                link: '#project_overview',
                title: 'Data Management',
                fontSize: '14px',
                data: [
                    {
                        id: 1,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 2,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 3,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    }
                ]
            },
            {
                id: 5,
                icon: 'icon-dl-pipeline-filled',
                link: '#project_overview',
                title: 'Pipelines',
                fontSize: '14px',
                hasSeparator: true
            },
            {
                id: 6,
                icon: 'icon-dl-workflows',
                link: '#project_overview',
                title: 'Workflow',
                fontSize: '14px'
            },
            {
                id: 7,
                icon: 'icon-dl-faas',
                link: '#project_overview',
                title: 'Applications (FaaS)',
                fontSize: '14px',
                data: [
                    {
                        id: 1,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 2,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    },
                    {
                        id: 3,
                        icon: 'icon-dl-project-filled',
                        link: '#person',
                        title: 'Active Project',
                        subtitle: 'lorem ipsum dolor 123',
                        fontSize: '14px'
                    }
                ]
            }
        ])

        return {
            leftItems,
            rightItems,
            navbarLeftItems
        }
    }
})
</script>

<style scoped lang="scss"></style>
