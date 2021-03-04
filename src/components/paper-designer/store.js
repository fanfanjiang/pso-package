import { CPNT, DEFAULT } from "./const";
import Module from "../plugin-module/store";
import API from "../../service/api.js";

export default class Paper extends Module {

    static CPNT = CPNT;

    static DEFAULT = DEFAULT;

    constructor(options) {
        super(options);
        this.prepareArgs = options.prepareArgs || {};

        this.activePanelTab = 0;

        this.paperConfig = {
            authRequired: false,
            nameRequired: true,
            IDRequired: false,
            phoneRequired: false,
            addressRequired: false,
            passScore: 60,
            order: [],
            examEndSqlRequired: false,
            examEndSql: [],
            gradeEndSqlRequired: false,
            gradeEndSql: [],
            args: [],
            paperNameRefer: '',
            unlimited: true,
            examLimit: 1,
            gradeable: true,
            showResult: false
        }
    }

    onInitialized() {
        const { tp_content } = this.pluginCfg;
        if (tp_content) {
            const data = JSON.parse(tp_content);
            if (typeof data === 'object') {
                this.paperConfig = Object.assign(this.paperConfig, data);
            }
            if (this.prepareArgs[this.paperConfig.paperNameRefer]) {
                this.pluginCfg.tp_name = this.prepareArgs[this.paperConfig.paperNameRefer];
            }
        }
        return;
    }

    async savePaperConfig() {
        const ret = await API.templates({
            data: { tp_code: this.code, tp_content: JSON.stringify(this.paperConfig) },
            method: "put",
        });
        this.$vue.ResultNotify(ret);
    }
}