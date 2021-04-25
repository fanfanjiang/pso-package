import FVStore from '../form-view/store';
import API from '../../service/api'
import { genComponentData } from '../form-designer/helper'
import { FILTER_TYPE_ARY } from "../../../share/const/filter";

export default class SuperViewStore extends FVStore {
    constructor(options) {
        super(options);
        this.sourceType = options.sourceType;
        this.urine = options.urine;
        this.outerActions = options.outerActions || [];
    }

    checkActionUsable(id) {
        return this.outerActions.indexOf(id);
    }

    async initialize(id, usedColumn) {
        if (this.sourceType === '0') {
            await super.initialize(id, usedColumn);

            //动作清除
            for (let act of this.actionMGR.actions) {
                const index = this.checkActionUsable(act.id);
                if (index === -1) {
                    this.actionMGR.actions.splice(index, 1);
                }
            }
        }
        if (this.sourceType === '1') {
            if (this.urine) {
                const { child_content } = this.urine;
                child_content.forEach(({ field, name, searchType }) => {
                    const exist = _.find(FILTER_TYPE_ARY, { id: searchType });
                    const cpnt = genComponentData({ componentid: exist ? exist.cid : 'text', _fieldValue: field, _fieldName: name });
                    cpnt.field_name = field;
                    cpnt.display = name;
                    this.fields.push(cpnt);
                })
            }
        }
    }

    async fetchStatus() {
        if (this.sourceType === '0') {
            await super.fetchStatus();
        }
        if (this.sourceType === '1') {
            await this.fetch();
        }
    }

    async fetch() {
        if (this.sourceType === '0') {
            await super.fetch();
        }
        if (this.sourceType === '1') {
            this.fetching = true;

            const data = this.getFetchParams();
            data.child_id = this.urine.child_id;

            const ret = await API.getPluginModuleData(data);

            if (ret.success) {
                this.instances = ret.data.DATA;
                this.dataTotal = ret.total;
                this.summary = ret.sum || null;

                this.checkInstToGO();
            }

            this.$vue.$emit("data-loaded", this.instances);
            this.fetching = false;
        }
    }
}