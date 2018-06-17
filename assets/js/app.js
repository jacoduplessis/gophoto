import ThumbnailList from './photo-list.js'

export default {
    name: 'app',
    components: {
        ThumbnailList
    },
    template: `
        <b-container fluid>
            <b-breadcrumb :items="pathSegments"></b-breadcrumb>
            <input v-model="dirPath" placeholder="path">
            
            <b-btn variant="primary" @click="read">Read</b-btn>
            <pre v-for="recent in recents">{{recent}}</pre>
            <h2>Images</h2>
         
            <thumbnail-list :images="images"></thumbnail-list>
        </b-container>
    `,
    data() {
        return {
            dirPath: null,
            files: [],
            images: [],
            recents: [],
        }
    },
    created() {
      this.loadRecents()
      if (this.dirPath) this.read()
    },
    computed: {

        pathSegments() {
            const segments = this.dirPath.split("/").map((segment, ix, arr) => {

                return {text: segment, href: '#'}
            })
            segments.splice(0, 1)
            segments.splice(segments.length - 1, 1)
            segments[segments.length - 1].active = true
            return segments

        }
    },
    methods: {
        loadRecents() {this.recents = JSON.parse(localStorage.getItem("recents", "[]"))},
        read() {

            const params = {
                dir: this.dirPath
            }
            axios.get('/api/read', {params}).then(resp => {
                this.recents.unshift(this.dirPath) // TODO: no duplicates
                localStorage.setItem("recents", JSON.stringify(this.recents))
                this.files = resp.data.files
                this.images = resp.data.images
            })

        },
    }
}

