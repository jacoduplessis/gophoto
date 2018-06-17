export default {

    template: `<span><b-dropdown text="Action" class="m-md-2">
    <b-dropdown-item @click="showModal">First Action</b-dropdown-item>
    <b-dropdown-item>Second Action</b-dropdown-item>
    <b-dropdown-item>Third Action</b-dropdown-item>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item>Something else here...</b-dropdown-item>
    <b-dropdown-item disabled>Disabled action</b-dropdown-item>
    </b-dropdown>
      <b-modal v-model="display">Will perform {{action}}</b-modal>
    </span>
`,
    data() {
        return {
            display: false,
            action: '',
        }
    },

    methods: {
        showModal(event) {
            this.action = event.target.textContent
            this.display = true
        }
    }
}