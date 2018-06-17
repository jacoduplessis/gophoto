export default {

    // language=Vue format=true
    template: `        
      <b-container fluid>
        <b-form-group label="Width">
          <b-form-input v-model.number="width" placeholder="1920"></b-form-input>
        </b-form-group>
        <b-form-group label="Height">
          <b-form-input v-model.number="height" placeholder="Height"></b-form-input>
        </b-form-group>
        <b-form-group label="Destination">
          <b-form-input v-model="dist" placeholder="/path/to/directory"></b-form-input>
        </b-form-group>
        <b-btn @click="submit">Submit</b-btn>
      </b-container>`,
    data() {
        return {
            width: 1920,
            height: 1080,
            dist: "",
        }
    },
    props: {
        selected: {
            type: Array,
            default: () => [],
        }
    },
    methods: {
        submit() {
            axios.post('/api/export', {
                width: this.width,
                height: this.height,
                dist: this.dist,
                files: this.selected
            }).then(r => {
                console.log("done")
            })
        }
    }
}