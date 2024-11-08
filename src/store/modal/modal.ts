export default {
    namespaced: true,
    state: {
        is_modal: false as Boolean,
        data: {
            id: '' as String, 
            title: '' as String,
            part: '' as String,
            color: '' as String
        },
        is_edit: false as Boolean
    },
    getters: {},
    mutations: {
        openModal(state: { is_modal: Boolean, is_edit: Boolean, data: { id: String, title: String, part: String, color: String }}, payload: { id: String, title: String, part: String, color: String, is_edit: Boolean }) {
            state.is_modal = true
            state.is_edit = payload.is_edit  
            state.data.id = payload.id
            state.data.title = payload.title
            state.data.part = payload.part
            state.data.color = payload.color
        },
        closeModal(state: { is_modal: Boolean, is_edit: Boolean, data: { id: String, title: String, part: String, color: String }}) {
            state.is_modal = false
            state.is_edit = false
            state.data = {
                id: '',
                title: '',
                part: '',
                color: ''
            }
        },
        // Обновление данных сектора
        updateSectorData(state: {data: { id: String, title: String, part: String, color: String }}, updatedData: { id: String, title: String, part: String, color: String }) {
            state.data.id = updatedData.id 
            state.data.title = updatedData.title
            state.data.part = updatedData.part
            state.data.color = updatedData.color
        }
    }
}