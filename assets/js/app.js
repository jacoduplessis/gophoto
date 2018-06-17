import PhotoList from './photo-list.js'

export default {
    name: 'app',
    components: {
        PhotoList
    },
    // language=Vue format=true
    template: `
      <b-container fluid>
        <b-breadcrumb :items="pathSegments"></b-breadcrumb>
        <input v-model="dirPath" placeholder="path">

        <b-btn variant="primary" @click="read">Read</b-btn>
        <pre v-for="recent in recents">{{recent}}</pre>

        <photo-list :images="images"></photo-list>
      </b-container>
    `,
    data() {
        return {
            dirPath: null,
            images: [],
            recents: [],
            pathSegments: ['...']
        }
    },
    created() {
        this.loadRecents()
        if (this.recents.length > 0) this.dirPath = this.recents[0]
        if (this.dirPath) this.read()
    },
    computed: {},
    methods: {
        computeSegments() {
            if (!this.dirPath) return ['...']
            const segments = this.dirPath.split("/").map((segment, ix, arr) => {

                return {text: segment, href: '#'}
            })
            segments.splice(0, 1)
            segments.splice(segments.length - 1, 1)
            segments[segments.length - 1].active = true
            return segments
        },
        loadRecents() {
            this.recents = JSON.parse(localStorage.getItem("recents", "[]"))
        },
        read() {
            const params = {
                dir: this.dirPath
            }
            axios.get('/api/read', {params}).then(resp => {
                this.recents.unshift(this.dirPath)
                this.recents = Array.from(new Set(this.recents))
                localStorage.setItem("recents", JSON.stringify(this.recents))

                this.images = resp.data.images
            })
            this.pathSegments = this.computeSegments()
        },
    }
}

