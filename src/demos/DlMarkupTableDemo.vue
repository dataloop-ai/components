<template>
    <div class="q-pa-md">
        <dl-option-group
            v-model="separator"
            inline
            :options="separatorOptions"
        />

        <dl-markup-table
            :separator="separator"
            flat
            bordered
        >
            <thead>
                <dl-tr>
                    <dl-th class="text-left">
                        Dessert (100g serving)
                    </dl-th>
                    <dl-th class="text-right">
                        Calories
                    </dl-th>
                    <dl-th class="text-right">
                        Fat (g)
                    </dl-th>
                    <dl-th class="text-right">
                        Carbs (g)
                    </dl-th>
                    <dl-th class="text-right">
                        Protein (g)
                    </dl-th>
                    <dl-th class="text-right">
                        Sodium (mg)
                    </dl-th>
                </dl-tr>
            </thead>
            <tbody>
                <dl-tr>
                    <dl-td class="text-left">
                        Frozen Yogurt
                    </dl-td>
                    <dl-td class="text-right">
                        159
                    </dl-td>
                    <dl-td class="text-right">
                        6
                    </dl-td>
                    <dl-td class="text-right">
                        24
                    </dl-td>
                    <dl-td class="text-right">
                        4
                    </dl-td>
                    <dl-td class="text-right">
                        87
                    </dl-td>
                </dl-tr>
                <dl-tr>
                    <dl-td class="text-left">
                        Ice cream sandwich
                    </dl-td>
                    <dl-td class="text-right">
                        237
                    </dl-td>
                    <dl-td class="text-right">
                        9
                    </dl-td>
                    <dl-td class="text-right">
                        37
                    </dl-td>
                    <dl-td class="text-right">
                        4.3
                    </dl-td>
                    <dl-td class="text-right">
                        129
                    </dl-td>
                </dl-tr>
                <dl-tr>
                    <dl-td class="text-left">
                        Eclair
                    </dl-td>
                    <dl-td class="text-right">
                        262
                    </dl-td>
                    <dl-td class="text-right">
                        16
                    </dl-td>
                    <dl-td class="text-right">
                        23
                    </dl-td>
                    <dl-td class="text-right">
                        6
                    </dl-td>
                    <dl-td class="text-right">
                        337
                    </dl-td>
                </dl-tr>
                <dl-tr>
                    <dl-td class="text-left">
                        Cupcake
                    </dl-td>
                    <dl-td class="text-right">
                        305
                    </dl-td>
                    <dl-td class="text-right">
                        3.7
                    </dl-td>
                    <dl-td class="text-right">
                        67
                    </dl-td>
                    <dl-td class="text-right">
                        4.3
                    </dl-td>
                    <dl-td class="text-right">
                        413
                    </dl-td>
                </dl-tr>
                <dl-tr>
                    <dl-td class="text-left">
                        Gingerbread
                    </dl-td>
                    <dl-td class="text-right">
                        356
                    </dl-td>
                    <dl-td class="text-right">
                        16
                    </dl-td>
                    <dl-td class="text-right">
                        49
                    </dl-td>
                    <dl-td class="text-right">
                        3.9
                    </dl-td>
                    <dl-td class="text-right">
                        327
                    </dl-td>
                </dl-tr>
            </tbody>
        </dl-markup-table>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue-demi'
import { DlMarkupTable, DlOptionGroup, DlTd, DlTr, DlTh } from '../components'

export default defineComponent({
    name: 'DlMarkupTableDemo',
    components: {
        DlMarkupTable,
        DlOptionGroup,
        DlTd,
        DlTr,
        DlTh
    },
    setup() {
        return {
            separator: ref('vertical'),
            separatorOptions: [
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
                { label: 'Cell', value: 'cell' },
                { label: 'None', value: 'none' }
            ]
        }
    }
})
</script>
