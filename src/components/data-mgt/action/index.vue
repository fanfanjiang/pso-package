<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <div class="pso-tabs">
        <div class="pso-tabs-header">
          <div class="pso-tabs-title">
            <i class="el-icon-s-promotion"></i>
            <span>按钮</span>
          </div>
          <div class="pso-tabs-r">
            <el-button size="mini" icon="el-icon-plus" circle @click="addAction(true)"></el-button>
          </div>
        </div>
        <el-tabs tab-position="left" v-model="curTab">
          <el-tab-pane v-for="(n, i) in actions" :label="n.name" :name="n.id" :key="i">
            <div class="pso-tabs-item" slot="label">
              <span>{{ n.name }}</span>
              <div class="pso-tabs-item__ctrl" v-if="n.deleteable">
                <el-popconfirm title="你确定要删除吗？" @confirm="delAction(i)">
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="pso-view-body">
      <designer
        v-if="curAction"
        :action="curAction"
        :options="options"
        :code="store.data_code"
        :plugins="plugins"
        :options-withsys="optionsWithsys"
      ></designer>
    </div>
  </div>
</template>
<script>
import { MgtMixin } from "../../../mixin/view";
import shortid from "shortid";
import Designer from "./designer";
import { formatJSONList } from "../../../utils/util";
import { makeSysFormFields } from "../../../tool/form";

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
  deleteable: true,
  beforeScript: [],
  scriptable: false,
  script: [],
  rule: [],
  ruleType: "1",
  color: "",
  icon: "",

  linkable: false,
  openLink: "",
  bindPlugin: "",
  linkParams: [],
};

const DEFAULT = [{ id: "add", name: "新增", deleteable: false }];
export default {
  mixins: [MgtMixin],
  components: { Designer },
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
    addAction(showEditor) {
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