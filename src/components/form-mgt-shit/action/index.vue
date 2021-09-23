<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <shit-tab
        title="按钮"
        :deleteable="false"
        :data="actions"
        v-model="curTab"
        @add="addAction(true)"
        @remove="delAction($event.i)"
      ></shit-tab>
    </div>
    <div class="pso-view-body" style="position: relative">
      <designer
        v-if="curAction"
        :action="curAction"
        :options="options"
        :code="store.data_code"
        :plugins="plugins"
        :options-withsys="optionsWithsys"
      ></designer>
      <shit-save @save="$emit('save')"></shit-save>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../../mixin/view";
import shortid from "shortid";
import Designer from "./designer";
import { formatJSONList } from "../../../utils/util";
import { makeSysFormFields } from "../../../tool/form";
import ShitTab from "../tab";
import ShitSave from "../save.vue";

const FIELDS = {
  name: "按钮",
  id: "",
  method: "1",
  mode: "1",
  modeTarget: "1",
  modeContent: "1",
  batchable: "1",
  fields: {},
  remark: "",
  beforeScriptable: false,
  showBefMsg: true, //显示成功提示
  deleteable: true,
  beforeScript: [],
  scriptable: false,
  script: [],
  befSaveScriptable: false,
  befSaveScript: [],
  rule: [],
  ruleType: "1",
  color: "",
  icon: "",
  location: "1",

  linkable: false,
  openLink: "",
  bindPlugin: "",
  linkParams: [],
  diseditable: false,

  linkFormView: false,
  formViewField: [],
  formViewOpts: [],
  FormViewAuth: 0,
};

const DEFAULT = [{ id: "add", name: "新增", deleteable: false }];
export default {
  mixins: [MgtMixin],
  components: { Designer, ShitTab, ShitSave },
  props: {
    actions: Array,
    store: null,
  },
  data() {
    return {
      curTab: "",
      options: [],
      plugins: [],
      curAction: null,
    };
  },
  watch: {
    curTab() {
      this.getCurAction();
    },
  },
  async created() {
    for (let d of DEFAULT) {
      const exist = _.find(this.actions, { id: d.id });
      if (!exist) {
        this.actions.unshift({ ..._.cloneDeep(FIELDS), ..._.cloneDeep(d) });
      }
    }
    if (this.actions.length) {
      formatJSONList(this.actions, FIELDS);
      this.curTab = this.actions[0].id;
    }
    this.options = this.store.search({ onlyData: true, options: { db: true } });
    this.optionsWithsys = this.options.concat(makeSysFormFields());
    this.plugins = (await this.API.trees({ data: { dimen: 4 } })).data.tagtree.filter((t) => t.is_leaf);
  },
  methods: {
    addAction() {
      const id = shortid.generate();
      const action = { ..._.cloneDeep(FIELDS), id };
      this.actions.push(action);
      this.curTab = id;
    },
    delAction(index) {
      this.actions.splice(index, 1);
      const num = this.actions.length;
      if (num) {
        this.curTab = this.actions[num - 1].id;
      }
      this.$emit('save');
    },
    getCurAction() {
      this.curAction = null;
      this.$nextTick(() => {
        this.curAction = _.find(this.actions, { id: this.curTab });
      });
    },
  },
};
</script>