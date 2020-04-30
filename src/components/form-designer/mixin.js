import emitter from "@/mixin/emitter";

export const common = {
    mixins: [emitter],
    componentName: "PsoformItem",
    props: {
        cpnt: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            initialized: false
        }
    },
    watch: {
        "cpnt.store.fid"(val) {
            if (val === this.cpnt.fid && !this.initialized) {

                if (this.$refs.codemirror) {
                    this.$nextTick(() => {
                        this.$refs.codemirror.codemirror.refresh();
                        this.initialized = true;
                    });
                }
            }
        }
    }
};

export const formFun = {
    props: {
    },
    data() {
        return {
        }
    },
    watch: {
  
    },
    methods: {
        
    },
};