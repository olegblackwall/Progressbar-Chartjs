<template>
    <transition name="fade">
        <div class="test-modal" v-if="modal_state.is_modal">
            <div @click="closeModal()" class="test-modal__shadow"></div>
            <div class="test-modal__container">
                <span class="modal-title">{{ modal_state.is_edit ? 'Редактирование сектора' : 'Добавление сектора' }}</span>
                <div class="modal-inputs-list" v-for="input in inputs_list" :key="input.id">
                    <inputCmp 
                        :input_label="input.label"
                        :input_value="input.value"
                        @set_value="updateInputValue(input.id, $event.value)"
                    />
                    <div v-if="input.id === 'color'" class="input-color-settings">
                        <span class="input-color-circle" :style="{ backgroundColor: colour }" @click="toggleColorPicker()"></span>
                        <svg :class="{ _active: color_picker_opener }" @click="toggleColorPicker()" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L7.64645 9.64645C7.84171 9.84171 8.15829 9.84171 8.35355 9.64645L12 6" stroke="#17161D" stroke-width="1.3" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <transition name="fadeHeight">
                    <Vue3ColorPicker
                        v-if="color_picker_opener"
                        v-model="colour"
                        @update:modelValue="updateColor"
                        :inputType="'HSL'"
                        :type="'HEX'"
                        :mode="'solid'"
                        :showInputMenu="false"
                        :showPickerMode="false"
                        :showColorList="false"
                    />
                </transition>
                <btnCmp 
                    class="modal-btn"
                    :btn_text="modal_state.is_edit ? 'Редактировать сектор' : 'Добавить сектор'"
                    @click="modal_state.is_edit ? editSector() : addSector()"
                />
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { defineComponent, defineEmits, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import inputCmp from '@/components/ui-components/input-cmp/input-cmp.vue'
import btnCmp from '@/components/ui-components/btn-cmp/btn-cmp.vue'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
import '@cyhnkckali/vue3-color-picker/dist/style.css'

const emit = defineEmits(['update_sector', 'add_sector'])
const store = useStore()
const modal_state = store.state.modal_module

const colour = ref<string>('')
const color_picker_opener = ref<boolean>(false)

// Входные данные для модального окна
const inputs_list = reactive([
    { id: 'title', label: 'Наименование', value: '' },
    { id: 'value', label: 'Значение', value: '' },
    { id: 'color', label: 'Цвет', value: '' },
])

// Обработка открытия/закрытия модального окна и цветового пикера
watch(() => modal_state.is_modal, (is_modal) => {
    if (is_modal) {
        if (modal_state.is_edit) {
            inputs_list.find(input => input.id === 'title')!.value = modal_state.data.title
            inputs_list.find(input => input.id === 'value')!.value = modal_state.data.part
            inputs_list.find(input => input.id === 'color')!.value = modal_state.data.color
            colour.value = modal_state.data.color
        } else {
            inputs_list.forEach(input => input.value = '')
            colour.value = ''
        }
    }
})

const toggleColorPicker = () => {
    color_picker_opener.value = !color_picker_opener.value
}

const updateInputValue = (id: string, new_value: string) => {
    const input = inputs_list.find(input => input.id === id)
    if (input) input.value = new_value
}

const editSector = () => {
    const updated_data = {
        id: modal_state.data.id,
        title: inputs_list.find(input => input.id === 'title')!.value,
        part: inputs_list.find(input => input.id === 'value')!.value,
        color: inputs_list.find(input => input.id === 'color')!.value
    }
    emit('update_sector', updated_data)
    closeModal()
}

const addSector = () => {
    const new_sector = {
        title: inputs_list.find(input => input.id === 'title')!.value,
        part: inputs_list.find(input => input.id === 'value')!.value,
        color: inputs_list.find(input => input.id === 'color')!.value
    }
    emit('add_sector', new_sector)
    closeModal()
}

const updateColor = (new_color: string) => {
    colour.value = new_color
    const input_color = inputs_list.find(input => input.id === 'color')
    if (input_color) input_color.value = new_color
}

const closeModal = () => {
    store.commit('modal_module/closeModal')
}

defineComponent({
    components: {
        inputCmp,
        btnCmp,
        Vue3ColorPicker
    }
})
</script>