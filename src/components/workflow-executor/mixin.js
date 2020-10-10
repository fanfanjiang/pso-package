import emitter from "../../mixin/emitter";
import { REVIEW_OP_TYPE, REVIEW_STATUS } from "../../const/workflow";
const UAParser = require("../../../share/util/u-agent");
import WfStore from "./store";
import { mapState } from "vuex";

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
    computed: {
        ...mapState(["base"]),
    },
    watch: {

    },
    async created() {
        const parser = new UAParser();
        this.isMobile = parser.getResult().device.type === "mobile";

        this.store = new WfStore({
            copy: this.params.copy,
            extend: this.params.extend,
            displayMode: this.params.displayMode,
            curUser: this.base.user,
            defForm: this.params.defForm
        });

        await this.store.init({ cfgId: this.params.node_id, instanceId: this.params.instance && this.params.instance.instanceId });
    },
    methods: {
        print(dom) {
            this.createPDF(dom, this.store.data.name, true);
        }
    }
};

export const op = {
    mixins: [emitter],
    data() {
        return {
            REVIEW_OP_TYPE: REVIEW_OP_TYPE,
            REVIEW_STATUS: REVIEW_STATUS
        };
    },
    methods: {
        async saveForm() {
            //暂存 
            try {
                const formData = await this.store.getFormData();
                this.dispatch("PsoWfExecutorBox", "op-before-save", { optype: 0, formData });
                formData && this.excuted(await this.store.hold(formData), 0);
            } catch (error) {
                this.$message({ message: error.message, type: "warning" });
            }
        },
        async nextStep(optype, isAppendForm = true) {
            try {
                const formData = await this.store.getFormData();
                this.dispatch("PsoWfExecutorBox", "op-before-next", { optype, formData });
                if (formData) {
                    const ret = await this.store.doNextStep({ optype, formData: isAppendForm ? formData : null });
                    if (ret.data && ret.data.instance) {
                        //必须选择下一步执行人
                        this.store.setInstanceData(ret.data.instance);
                        this.confirm(false);
                        this.store.steping = false;
                    } else {
                        this.excuted(ret, optype);
                    }
                }
            } catch (error) {
                console.log(error);
                this.store.steping = false;
                this.$message({ message: error.message, type: "warning" });
            }
        },
        excuted(result, optype) {
            this.ResultNotify(result, "");
            this.dispatch("PsoWfExecutorBox", "op-excuted", { optype, status: this.store.data.status, result });
        }
    }
};