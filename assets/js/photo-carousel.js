export default {
    template: `<b-carousel
                style="text-shadow: 1px 1px 2px #333; height: 100vh"
                controls
                indicators
                background="#ababab"
                :interval="interval"
                img-width="1024"
                img-height="480"
                v-model="slide"
    >
      
      <b-carousel-slide v-for="image in images" caption="First slide"
                        text="Nulla vitae elit libero, a pharetra augue mollis interdum."
                        :key="image"
      >
       <img slot="img" class="d-block" :src="'/files' + image" style="max-height: 100vh; margin: 0 auto">
      
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