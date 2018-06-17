export default {

    template: `<b-img fluid-grow :src="src" style="cursor: pointer"></b-img>`,
    // note: using b-img-lazy is much too slow
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