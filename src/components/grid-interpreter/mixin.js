import PsoGridWrapper from "./wrapper";
import emitter from "../../mixin/emitter";

export const BaseMixin = {
    components: { PsoGridWrapper },
    mixins: [emitter],
    props: {
        cpnt: Object
    },
    methods: {
        checkmore() {
            if (this.$refs.wrapper) {
                this.$refs.wrapper.checkmore();
            }
        },
        async clickInst(data) {
            this.dispatch("PsoGridInterpreter", "instance-click", { cpnt: this.cpnt, data });
            const { clickEventable, clickAPI } = this.cpnt.data;
            if (clickEventable && !!clickAPI) {
                const ret = await this.API.request(clickAPI, { data: { data, urine: this.cpnt.urine }, showMsg: false })
            }
        }
    },
}