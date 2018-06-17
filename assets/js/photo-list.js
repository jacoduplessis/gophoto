import PhotoThumbnail from './photo-thumbnail.js'
import PhotoActions from './photo-actions.js'
import PhotoCarousel from './photo-carousel.js'


export default {


    components: {PhotoThumbnail, PhotoActions, PhotoCarousel},

    // language=Vue format=true
    template: `
      <div>
        <div class="d-flex justify-content-between">
          <p class="text-muted">Right-click on images to select.</p>
          <div class="d-flex align-items-center">
            <photo-actions :selected="Array.from(Object.keys(selected))" @clear="selected = {}"></photo-actions>
            <b-btn @click="carousel = !carousel">Show Carousel</b-btn>
          </div>
        </div>
        <div v-if="carousel">
          <photo-carousel :images="images"></photo-carousel>
        </div>
        <b-row class="px-2">
          <b-col sm="4" lg="3" xl="2" v-for="image in images" :key="image.SourceFile" class="thumbnail-col">
            <photo-thumbnail :class="{'thumbnail-selected': !!selected[image.SourceFile]}"
                             @click.right.native.prevent="toggleSelect(image.SourceFile)"
                             @click.native="thumbClick(image)" class="my-2"
                             :src="'http://localhost:8045/smartcrop?width=300&height=300&file=' + image.SourceFile"></photo-thumbnail>
          </b-col>
        </b-row>
        <b-modal id="lightbox" size="lg" lazy v-model="showLightbox" :title="activeImage ? activeImage.FileName : ''">
          <slit
          <template v-if="activeImage">
            <b-img :src="'/files' + activeImage.SourceFile" fluid></b-img>
            <pre>{{ activeImage }}</pre>
          </template>
        </b-modal>
      </div>
    `,
    data() {
        return {
            selected: {},
            carousel: false,
            activeImage: null,
            showLightbox: false,
        }
    },
    computed: {
        numSelected() {
            return Object.keys(this.selected).length
        }
    },
    methods: {
        toggleSelect(path) {
            if (this.selected.hasOwnProperty(path)) {
                this.$delete(this.selected, path)
            } else {
                this.$set(this.selected, path, true)
            }
        },
        thumbClick(image) {
            this.activeImage = image
            this.showLightbox = true
        }
    },
    props: {
        images: {
            type: Array,
            default: []
        }
    }
}