import PsoGridWrapper from "./wrapper";

export const BaseMixin = {
    components: { PsoGridWrapper },
    props: {
        cpnt: Object
    },
    methods: {
        checkmore() {
            if (this.$refs.wrapper) {
                this.$refs.wrapper.checkmore();
            }
        },
    },
} 