<template>
    <div class="test-input">
        <input 
            class="test-input__field"
            :class="{'_fill-input': input_field_value.value.length}"
            :type="input_type"
            v-model="input_field_value.value"
            @keyup="setValue"
            v-bind="$attrs"
        />
        <label class="test-input__label">{{ input_label }}</label>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'

const props = defineProps({
    input_type: {
        type: String,
        default: 'text'
    },
    input_value: {
        type: String,
        default: ''
    },
    input_label: {
        type: String,
        default: 'label'
    }
})

const emit = defineEmits(['set_value'])

const input_field_value = reactive({
    value: props.input_value
})

watch(() => props.input_value, (new_value) => {
    input_field_value.value = new_value
})

const setValue = () => {
    emit('set_value', {value: input_field_value.value, type: props.input_type})
}
</script>
