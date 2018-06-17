import PhotoExport from './photo-export.js'

export default {
    components: {PhotoExport},
    // language=Vue format=true
    template: `
      <div v-if="numSelected">
        With <b>{{numSelected}}</b> (<a href="#" @click.prevent="$emit('clear')">clear</a>) selected:
        <b-dropdown text="Action" class="m-md-2">
          <b-dropdown-item @click="showModal('Export', 'photo-export')">First Action</b-dropdown-item>
          <b-dropdown-item @click="showModal('Export', 'photo-export')">Export</b-dropdown-item>
          <b-dropdown-item>Third Action</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item>Something else here...</b-dropdown-item>
          <b-dropdown-item disabled>Disabled action</b-dropdown-item>
        </b-dropdown>
        <b-modal v-model="display" :title="modalTitle" size="lg">
          <component :is="selectedComponent" :selected="selected"></component>
        </b-modal>
      </div>
    `,
    data() {
        return {
            display: false,
            modalTitle: "",
            action: '',
            selectedComponent: PhotoExport,
        }
    },

    props: {
        selected: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        numSelected() {
            return Object.keys(this.selected).length
        }
    },
    methods: {
        showModal(title, component) {
            this.selectedComponent = component
            this.modalTitle = title
            this.display = true
        }
    }
}