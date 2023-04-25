<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, VNode, isVue2, h } from 'vue-demi'
import { textSlot } from '../../../utils/render'

export default defineComponent({
    name: 'DlTabPanels',
    model: {
        prop: 'modelValue'
    },
    props: {
        modelValue: { type: String, required: true }
    },
    data() {
        return {
            uuid: `dl-tab-panels-${v4()}`
        }
    },
    computed: {
        panels(): any[] {
            return textSlot(this.$slots)
        },
        activeTab(): VNode | undefined {
            if (isVue2) {
                const tabIndex = this.panels.findIndex(
                    (item) => item?.data?.key === this.modelValue
                )
                return this.panels[tabIndex] as any
            }
            return (this.panels as any[])[0].children.find(
                (panel: any) => panel.key === this.modelValue
            )
        }
    },
    render(createElement: Function) {
        const renderFn = isVue2 ? createElement : h
        return renderFn(
            'div',
            {
                attrs: {
                    id: this.uuid
                }
            },
            [this.activeTab]
        )
    }
})
</script>
