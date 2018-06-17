import PhotoThumbnail from './photo-thumbnail.js'
import PhotoActions from './photo-actions.js'
import PhotoCarousel from './photo-carousel.js'

export default {


    components: {PhotoThumbnail, PhotoActions, PhotoCarousel},

    template: `
        <div>
           
           <p v-if="numSelected">With {{numSelected}} selected: <photo-actions></photo-actions></p>
           <div class="d-flex justify-content-between">
            <p class="text-muted">Right-click on images to select.</p>
            <div><b-btn @click="carousel = !carousel">Show Carousel</b-btn></div>
           </div>
           <div v-if="carousel">
              <photo-carousel :images="images"></photo-carousel>
            </div>
           <b-row class="px-2">
           <b-col sm="4" lg="3" xl="2" v-for="path in images" :key="path" class="thumbnail-col">
                <photo-thumbnail :class="{'thumbnail-selected': !!selected[path]}" @click.right.native.prevent="toggleSelect(path)" class="my-2" :src="'/files' + path"></photo-thumbnail>         
             </b-col>
             </b-row>
             <b-btn v-b-modal.lightbox>Show Preview</b-btn>
             <b-modal id="lightbox" size="lg" lazy>
              <b-img :src="'/files' + images[0]" fluid></b-img>
            </b-modal>
            </div>
    `,
    data() {
        return {
            selected: {},
            carousel: false,
        }
    },
    computed: {
        numSelected() { return Object.keys(this.selected).length }
    },
    methods: {
        toggleSelect(path) {
            console.log('toggle', path)
            if (this.selected.hasOwnProperty(path)) {
                this.$delete(this.selected, path)
            } else {
                this.$set(this.selected, path, true)
            }
        }
    },
    props: {
        images: {
            type: Array,
            default: []
        }
    }
}