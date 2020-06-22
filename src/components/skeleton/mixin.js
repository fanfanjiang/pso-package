export const skeleton = {
    props: {
        rounded: {
            type: Boolean,
            default: true
        },
        centered: {
            type: Boolean,
            default: false
        },
        animated: {
            type: Boolean,
            default: true
        },
        heading: {
            type: Boolean,
            default: false
        },
        headimg: {
            type: Boolean,
            default: false
        },
        lines: {
            type: Number,
            default: 4
        },
        style: {
            type: Object,
            default: () => ({})
        }
    }
}