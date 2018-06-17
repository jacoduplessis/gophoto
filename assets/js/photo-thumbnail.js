export default {

    // template: `<b-img fluid-grow :src="src"></b-img>`,

    template: `<div :style="'background-image: url(' + src + ')'" style="background-size: cover; background-position: center center; height: 300px; width: 100%"></div>`,
    data() {
        return {
            selected: false
        }
    },
    props: {
        src: {
            type: String,
            required: true
        }
    }
}