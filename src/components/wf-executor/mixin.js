import emitter from "../../mixin/emitter";
import { REVIEW_OP_TYPE } from "../../const/workflow";
const UAParser = require("../../../share/util/u-agent");
import WfStore from "./store";

export const executor = {
    mixins: [emitter],
    componentName: "PsoWfExecutor",
    props: {
        params: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            store: null,
            isMobile: false
        };
    },
    async created() {
        const parser = new UAParser();
        this.isMobile = parser.getResult().device.type === "mobile";

        this.store = new WfStore({ copy: this.params.copy, extend: this.params.extend, displayMode: this.params.displayMode });
        await this.store.init({ cfgId: this.params.node_id, instanceId: this.params.instance && this.params.instance.instanceId });
    },
    methods: {
        print(dom) {
            this.createPDF(dom, this.store.data.name);
        }
    }
};

export const op = {
    mixins: [emitter],
    data() {
        return {
            REVIEW_OP_TYPE: REVIEW_OP_TYPE
        };
    },
    methods: {
        async saveForm() {
            //暂存
            try {
                const formData = await this.store.getFormData();
                this.dispatch("PsoWfExecutorBox", "op-before-save", { optype: REVIEW_OP_TYPE.save.value, formData });
                formData && this.excuted(await this.store.hold(formData));
            } catch (error) {
                this.$message({ message: error.message, type: "warning" });
            }
        },
        async nextStep(optype) {
            try {
                const formData = await this.store.getFormData();
                this.dispatch("PsoWfExecutorBox", "op-before-next", { optype, formData });
                formData && this.excuted(await this.store.doNextStep({ optype, formData }));
            } catch (error) {
                this.store.steping = false;
                this.$message({ message: error.message, type: "warning" });
            }
        },
        excuted({ success }) {
            this.$notify({ title: success ? "执行成功" : "执行失败", type: success ? "success" : "warning" });
            this.dispatch("PsoWfExecutorBox", "op-excuted");
        }
    }
};