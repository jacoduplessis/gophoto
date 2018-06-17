export default {
    // language=Vue format=true
    template: `
      <b-carousel
          style="text-shadow: 1px 1px 2px #333; height: 100vh"
          controls
          indicators
          background="#ababab"
          :interval="interval"
          img-width="1024"
          img-height="480"
          v-model="slide"
      >

        <b-carousel-slide v-for="image in images" :caption="image.Title" :key="image.SourceFile">
          <img slot="img" class="d-block" :src="'http://localhost:8045/files' + image.SourceFile" style="max-height: 100vh; margin: 0 auto">
          <p>{{image.DateTimeOriginal}}<br>{{ image.Description }}</p>
        </b-carousel-slide>
      </b-carousel>
    `,

    props: {
        images: {
            type: Array,
            default: [],
        },
        interval: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            slide: 0
        }
    }
}