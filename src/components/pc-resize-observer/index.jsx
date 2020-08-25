import ResizeObserver from 'resize-observer-polyfill';

const VueResizeObserver = {
    data() {
        this.curEl = null;
        this.observer = null;
        return {
            width: 0,
            heignt: 0
        }
    },
    mounted() {
        this.onUpdated();
    },
    updated() {
        this.onUpdated();
    },
    beforeDestroy() {
        this.destroy();
    },
    render() {
        return this.$slots.default[0];
    },
    methods: {
        onUpdated() {
            const el = this.$el;

            if (this.curEl !== el) {
                this.destroy();
                this.curEl = el;
            }
            if (!this.observer && el) {
                this.observer = new ResizeObserver(this.handleResize);
                this.observer.observe(el);
            }
        },
        handleResize(entries) {
            const { target } = entries[0];
            const { width, height } = target.getBoundingClientRect();
            if (width !== this.width || height !== this.height) {
                this.width = width;
                this.height = height;
                this.$emit('resize', { width, height })
            }
        },
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }
}

export default VueResizeObserver;