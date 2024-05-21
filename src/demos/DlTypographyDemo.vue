<template>
    <div>
        <div v-for="(item, index) in typographyTypes" :key="index">
            <DlTypography
                :color="item.color"
                :size="getItemSize(item)"
                :variant="item.variant"
            >
                Typography {{ item ? item.variant : item }}
            </DlTypography>
        </div>

        <DlButton>
            <dl-typography
                color="dl-color-tooltip-text"
                variant="p"
                size="small"
                bold
            >
                Typography Bold
            </dl-typography>
        </DlButton>
        <br />
        <br />
        <DlButton>
            <dl-typography
                color="dl-color-tooltip-text"
                variant="p"
                size="small"
                uppercase
            >
                Typography Uppercase
            </dl-typography>
        </DlButton>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton, DlTypography } from '../components'
import { DlTypographyVariant } from '../types'

export default defineComponent({
    name: 'DlTypographyDemo',
    components: {
        DlTypography,
        DlButton
    },
    data(): { typographyTypes: Record<string, any>[] } {
        return {
            typographyTypes: [
                {
                    variant: 'h1'
                },
                {
                    variant: 'h2'
                },
                {
                    variant: 'h3'
                },
                {
                    variant: 'h4'
                },
                {
                    variant: 'h5'
                },
                {
                    variant: 'h6'
                },
                {
                    variant: 'p'
                },
                {
                    variant: 'h1',
                    color: 'dl-color-secondary'
                },
                {
                    variant: 'body',
                    size: '30px',
                    color: 'dl-color-positive'
                },
                {
                    variant: 'p',
                    color: 'dl-color-warning'
                }
            ]
        }
    },
    methods: {
        getItemSize(item: Record<string, string>): string {
            return item.size || item.variant
        }
    }
})
</script>
