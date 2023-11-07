<template>
    <div>
        <dl-select
            :options="['one', 'two', 'three']"
            title="Title"
            required
            fit
        />
        <dl-select
            v-model="disabledSelected"
            :options="['disabled option', 'two', 'three']"
            title="Disabled"
            disabled
        />
        <dl-select
            v-model="selectedOption"
            width="84px"
            without-borders
            without-placeholder
            with-chips
            align-right
            :options="[
                { label: 'High', value: 'high', bgColor: 'dl-color-negative' },
                {
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker',
                    icon: 'icon-dl-search'
                },
                {
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
            required
        >
            <template #selected="scope">
                <dl-chip
                    :text-color="scope.opt.textColor"
                    :color="scope.opt.bgColor"
                >
                    {{ scope.opt.label }}
                </dl-chip>
            </template>
            <template #option="scope">
                <div class="flex">
                    <dl-chip
                        :text-color="scope.opt.textColor"
                        :color="scope.opt.bgColor"
                    >
                        {{ scope.opt.label }}
                    </dl-chip>
                </div>
            </template>
        </dl-select>

        <dl-select
            v-model="statusOption"
            width="96px"
            without-borders
            align-right
            :options="[
                {
                    label: 'Status 1',
                    value: 1,
                    badgeColor: 'var(--dl-color-disabled)'
                },
                {
                    label: 'Status 2',
                    value: 2,
                    badgeColor: 'var(--dl-color-secondary)'
                },
                {
                    label: 'Status 3',
                    value: 3,
                    badgeColor: 'var(--dl-color-positive)'
                },
                {
                    label: 'Status 4',
                    value: 4,
                    badgeColor: 'var(--dl-color-warning)'
                }
            ]"
            required
        >
            <template #selected="scope">
                <div style="display: flex; align-items: center; gap: 5px">
                    <dl-badge :color="scope.opt.badgeColor" />
                    {{ scope.opt.label }}
                </div>
            </template>
            <template #option="scope">
                <div style="display: flex; align-items: center; gap: 5px">
                    <dl-badge :color="scope.opt.badgeColor" />
                    {{ scope.opt.label }}
                </div>
            </template>
        </dl-select>
        fit content
        <dl-select
            v-model="statusOption"
            width="96px"
            without-borders
            fit-content
            align-right
            :options="[
                {
                    label: 'S1',
                    value: 1,
                    badgeColor: 'var(--dl-color-disabled)'
                },
                {
                    label: 'S 2',
                    value: 2,
                    badgeColor: 'var(--dl-color-secondary)'
                },
                {
                    label: 'S3',
                    value: 3,
                    badgeColor: 'var(--dl-color-positive)'
                },
                {
                    label: 'S4',
                    value: 4,
                    badgeColor: 'var(--dl-color-warning)'
                }
            ]"
            required
        >
            <template #selected="scope">
                <div style="display: flex; align-items: center; gap: 5px">
                    <dl-badge :color="scope.opt.badgeColor" />
                    {{ scope.opt.label }}
                </div>
            </template>
            <template #option="scope">
                <div style="display: flex; align-items: center; gap: 5px">
                    <dl-badge :color="scope.opt.badgeColor" />
                    {{ scope.opt.label }}
                </div>
            </template>
        </dl-select>

        with prepend
        <dl-select
            v-model="tasksFilter"
            multiselect
            :options="[
                { label: 'Hard', value: 'hard', count: 20 },
                { label: 'Easy', value: 'easy', count: 50 }
            ]"
            has-prepend
            all-items-option
        >
            <template #prepend>
                <dl-icon
                    size="12px"
                    icon="icon-dl-filter"
                />
            </template>
        </dl-select>
        custom search
        <dl-select
            v-model="selectedBySearch"
            size="m"
            title="Title"
            optional
            :options="searchOptions"
            searchable
            custom-filter
            emit-val
            @filter="filterFn"
        />
        normal search
        <dl-select
            v-model="selectedByFilteringSearch"
            :options="searchOptions"
            size="m"
            multiselect
            placeholder="contributors"
            searchable
        />

        <dl-select
            v-model="selectedWithEmitValue"
            title="Emit Value"
            :options="searchOptions"
            size="m"
            emit-value
        />

        Expandable tree view
        <dl-select
            v-model="selectedWithChildrenSearch"
            :options="treeOptions"
            size="m"
            multiselect
        />
        <dl-select
            v-model="selectedWithChildren"
            :options="treeOptions"
            size="m"
            multiselect
            searchable
        />
        <dl-select
            v-model="selectedWithChildrenSearch"
            :options="treeOptions"
            size="m"
            multiselect
            clearable
        />
        Capitalized options
        <dl-select
            v-model="selectedWithChildrenCapitalized"
            :options="treeOptions"
            size="m"
            multiselect
            searchable
            capitalized-options
        />
        Tree options with readonly options
        <dl-select
            v-model="selectedWithChildrenAndReadonly"
            :options="treeOptionsWithReadonly"
            size="m"
            multiselect
            searchable
            capitalized-options
        />
        With Fit
        <dl-select
            v-model="selectedWithFit"
            :options="[
                { label: 'Option 1', value: 1 },
                { label: 'Option 2, longer one', value: 2 },
                { label: 'Option 3', value: 3 }
            ]"
            size="m"
            multiselect
            searchable
            capitalized-options
            fit-content
            @change="logEvent"
        />
        With Label and sub label
        <dl-select
            v-model="selectedOption"
            searchable
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    labelColor: 'var(--dl-color-darker)',
                    subLabelColor: 'var(--dl-color-lighter)'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    labelColor: 'var(--dl-color-darker)',
                    subLabelColor: 'var(--dl-color-lighter)'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    labelColor: 'var(--dl-color-darker)',
                    subLabelColor: 'var(--dl-color-lighter)'
                }
            ]"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div :style="`color: ${scope.opt.labelColor}`">
                        {{ scope.opt.label }}
                    </div>
                    <div
                        :style="`color: ${scope.opt.subLabelColor}; font-size: 10px`"
                    >
                        {{ scope.opt.subLabel }}
                    </div>
                </div>
            </template>
        </dl-select>
        With tooltip
        <dl-select
            v-model="select2"
            title="With tooltip"
            :tooltip="'Test Me'"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>
        Small size
        <dl-select
            v-model="select3"
            :size="'s'"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>
        Small size with tooltip
        <dl-select
            v-model="select4"
            :size="'s'"
            title="test"
            tooltip="test me"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>

        Select with max-height
        <dl-select
            v-model="select5"
            :size="'s'"
            title="test"
            dropdown-max-height="50px"
            tooltip="test me"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>

        Select with virtual scrolling
        <dl-select
            v-model="selectedOption"
            :options="alotOfOptions ? alotOfOptions : []"
            style="margin-bottom: 150px"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>

        Select clearable
        <dl-select
            v-model="selectedOption"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
            clearable
            style="margin-bottom: 150px"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>

        Select with tooltip no title
        <dl-select
            v-model="selectedOption"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
            clearable
            style="margin-bottom: 150px"
            tooltip="test tooltip"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>

        Select with tooltip no title size small
        <dl-select
            v-model="selectedOption"
            :options="[
                {
                    subLabel: 'not so high',
                    label: 'High',
                    value: 'high',
                    bgColor: 'dl-color-negative'
                },
                {
                    subLabel: 'not so medium',
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    subLabel: 'not so low',
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ]"
            clearable
            style="margin-bottom: 150px"
            size="small"
            tooltip="test tooltip"
        >
            <template #option="scope">
                <div style="padding: 5px 0px">
                    <div>{{ scope.opt.label }}</div>
                    <div>{{ scope.opt.subLabel }}</div>
                </div>
            </template>
        </dl-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlChip, DlSelect, DlIcon, DlBadge } from '../components'
import { DlSelectOptionType } from '../components/compound/DlSelect/utils'

const defaultOptions = [
    { label: 'Contributor 1', value: 'c1' },
    { label: 'Contributor 2', value: 'c2' },
    { label: 'Contributor 3', value: 'c3' }
]

const treeOptions = [
    {
        label: 'root',
        value: 'root',
        children: [
            { label: 'child 1', value: 'c1' },
            { label: 'child 2', value: 'c2' },
            {
                label: 'child 3',
                value: 'c3',
                children: [
                    { label: 'child 4', value: 'c4' },
                    {
                        label: 'child 5',
                        value: 'c5',
                        children: [
                            { label: 'child 6', value: 'c6' },
                            {
                                label: 'child 7',
                                value: 'c7',
                                children: [
                                    { label: 'child 8', value: 'c8' },
                                    {
                                        label: 'child 9',
                                        value: 'c9',
                                        children: [
                                            { label: 'child 10', value: 'c10' },
                                            {
                                                label: 'child 11',
                                                value: 'c11',
                                                children: [
                                                    {
                                                        label: 'child 12',
                                                        value: 'c12'
                                                    },
                                                    {
                                                        label: 'child 13',
                                                        value: 'c13',
                                                        children: [
                                                            {
                                                                label: 'child 14',
                                                                value: 'c14'
                                                            },
                                                            {
                                                                label: 'Really long line Really long line Really long line Really long line Really long line Really long line',
                                                                value: 'c17',
                                                                children: [
                                                                    {
                                                                        label: 'child 15',
                                                                        value: '15'
                                                                    },
                                                                    {
                                                                        label: 'child 16',
                                                                        value: '16'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        label: 'root1',
        value: 'root1',
        children: [
            { label: 'child 1', value: 'c6' },
            { label: 'child 2', value: 'c7' },
            {
                label: 'child 3',
                value: 'c8',
                children: [
                    { label: 'child 4', value: 'c9' },
                    { label: 'child 5', value: 'c10' }
                ]
            }
        ]
    }
]

const treeOptionsWithReadonly = [
    {
        label: 'Without children',
        value: 'r0',
        readonly: true
    },
    {
        label: 'child 1',
        value: 'r1'
    },
    {
        label: 'child 2',
        value: 'r2'
    },
    {
        label: 'child 3',
        value: 'r3'
    },
    {
        label: 'With children',
        value: 'r4',
        readonly: true,
        children: [
            { label: 'child 1', value: 'c1' },
            { label: 'child 2', value: 'c2' },
            { label: 'child 3', value: 'c3' },
            { label: 'child 4', value: 'c4' },
            { label: 'child 5', value: 'c5' }
        ]
    },
    {
        label: 'With children & readonly child',
        value: 'r5',
        children: [
            { label: 'child 1', value: 'c1' },
            { label: 'child 2', value: 'c2' },
            { label: 'child 3', value: 'c3', readonly: true },
            { label: 'child 4', value: 'c4' },
            { label: 'child 5', value: 'c5' }
        ]
    },
    {
        label: 'Readonly option with children & readonly child',
        value: 'r6',
        readonly: true,
        children: [
            { label: 'child 1', value: 'c6' },
            { label: 'child 2', value: 'c7' },
            {
                label: 'child 3',
                value: 'c8',
                readonly: true,
                children: [
                    { label: 'child 4', value: 'c9' },
                    { label: 'child 5', value: 'c10' }
                ]
            }
        ]
    }
]

export default defineComponent({
    components: { DlSelect, DlIcon, DlChip, DlBadge },
    data() {
        return {
            selectedWithFit: [],
            selectedOption: {
                label: 'High',
                value: 'high',
                bgColor: 'dl-color-error',
                textColor: 'dl-color-white'
            },
            select2: null,
            select3: null,
            select4: null,
            select5: null,
            statusOption: {
                label: 'Status 1',
                value: 1,
                badgeColor: 'dl-color-disabled'
            },
            searchOptions: defaultOptions,
            treeOptions,
            treeOptionsWithReadonly,
            selectedBySearch: undefined,
            selectedByFilteringSearch: [],
            selectedWithEmitValue: 'c1',
            selectedWithChildren: [],
            selectedWithChildrenSearch: [],
            selectedWithChildrenAndReadonly: [],
            selectedWithChildrenCapitalized: [],
            tasksFilter: [],
            showAllOption: true,
            disabledSelected: 'disabled option'
        }
    },
    computed: {
        isNotSelected() {
            // @ts-ignore
            return defaultOptions.includes(this.selectedBySearch as any)
        },
        alotOfOptions(): DlSelectOptionType[] {
            const arr = [] as any[]

            for (let i = 0; i < 1000; ++i) {
                arr.push({
                    key: i,
                    subLabel: 'not so high',
                    label: 'High ' + i,
                    value: 'high',
                    bgColor: 'dl-color-negative'
                })
            }

            return arr
        }
    },
    methods: {
        logEvent(e: any) {
            console.log(e)
        },
        filterFn(val: string) {
            this.searchOptions = defaultOptions.filter(
                (v: { label: string; value: string } | undefined) =>
                    v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
            )
            this.showAllOption =
                this.searchOptions.length === defaultOptions.length
        },
        handleInput(e: Event) {
            return (e.target as HTMLInputElement).value
        },
        log(e: any) {
            console.log(e)
        }
    }
})
</script>
