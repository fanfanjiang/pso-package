<template>
  <div class="pso-form-sub" :class="subClass" v-loading="saving">
    <div class="pso-form-sub__l">
      <pso-wf-view ref="mainTable" :params="wfParams" op-column @initialized="mainLoaded" @data-loaded="formDataLoadedHandler">
        <template v-slot:column="mainColData">
          <el-button type="primary" size="mini" @click.stop="checkMainDetail(mainColData)">详情</el-button>
        </template>
      </pso-wf-view>
    </div>
    <div class="pso-form-sub__r" v-loading="initializing">
      <template v-if="asstables.length">
        <div class="pso-form-sub__subtab" v-show="asstables.length > 1">
          <el-tabs v-model="activeTab" @tab-click="handleTabclick">
            <el-tab-pane :label="t.name" :name="t.id" v-for="t in asstables" :key="t.id"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-form-sub__form">
          <pso-form-interpreter
            v-if="!loadingSub && dataId"
            ref="formSubImage"
            :form-entity="cfg"
            :data-id="dataId"
            :data-default="defForm"
            @data-loaded="formLoadedHandler"
            @cpnt-value-changed="formValChangeHandler"
            @asstable-change="formValChangeHandler"
          ></pso-form-interpreter>
        </div>
      </template>
      <template v-else>
        <pso-empty title="无关联数据"></pso-empty>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      activeTab: "",
      asstables: [],
      store: null,
      cfg: null,
      defForm: null,
      dataId: "",
      formNodes: [],
      loadingSub: false,
      saving: false,
    };
  },
  computed: {
    subClass() {
      return {
        displayRow: this.params.displayRow === "1",
        "hide-tab": this.asstables.length < 2,
      };
    },
    wfParams() {
      return { ...this.params, tableRowClick: this.mainClick };
    },
  },
  methods: {
    async mainLoaded({ store, cfg, defForm }) {
      this.cfg = cfg;
      this.defForm = defForm;
      this.formNodes = await this.API.getFormTree();
      const asstables = store.search({
        options: { componentid: "asstable" },
        onlyData: true,
        beforePush: (item) => {
          if (this.params.asstables && this.params.asstables.length) {
            return this.params.asstables.includes(item.data._fieldValue);
          }
          return true;
        },
      });
      this.asstables = asstables.map((item) => {
        const node = _.find(this.formNodes, { node_name: item._option });
        return { id: item._option, name: node.node_display };
      });
      if (this.asstables.length) {
        this.activeTab = this.asstables[0].id;
      }
      this.initializing = false;
    },
    checkMainDetail({ data }) {
      this.$refs.mainTable.loadExcutor(data.row);
    },
    mainClick(row) {
      this.loadingSub = true;
      this.dataId = row.leaf_id;
      this.$nextTick(() => (this.loadingSub = false));
      return true;
    },
    formDataLoadedHandler(data) {
      if (data.length) {
        if (this.dataId) {
          const exist = _.find(data, { leaf_id: this.dataId });
          if (exist) {
            this.mainClick(exist);
          }
        } else {
          this.mainClick(data[0]);
        }
      }
    },
    handleTabclick({ name }) {
      this.switchSub();
    },
    formLoadedHandler(store) {
      this.store = store;
      this.switchSub();
    },
    switchSub() {
      if (!this.store) return;
      this.store._forEach((cpnt) => {
        cpnt.data._fieldName = "";
        cpnt.data._hideForever = cpnt.data._option !== this.activeTab;
        this.$set(cpnt.data, "forceShow", false);
        if (cpnt.data._option === this.activeTab) {
          cpnt.data._hideOnNew = false;
          this.$set(cpnt.data, "forceShow", true);
        }
      });
    },
    formValChangeHandler({ trigger, cpnt }) {
      if (cpnt.data.componentid === "asstable" && trigger !== "action") {
        this.saveForm();
      }
    },
    async saveForm() {
      try {
        const formData = await this.$refs.formSubImage.makeData();
        this.saving = true;
        const ret = await this.API.form({ data: { leaf_id: this.dataId, formData }, method: "put" });
        this.ResultNotify(ret);
        this.saving = false;
      } catch (error) {
        return null;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-sub {
  display: flex;
  &.displayRow {
    flex-direction: column;
    height: 100%;
    .pso-form-sub__l {
      width: 100%;
      height: 60%;
      overflow-y: auto;
    }
    .pso-form-sub__r {
      width: 100%;
      height: 40%;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      z-index: 2;
    }
    .pso-form-sub__r {
      padding: 0 15px 15px 15px;
    }
  }
  &.hide-tab {
    .pso-form-sub__form {
      margin-top: 5px;
    }
  }
  .pso-form-sub__l {
    width: 50%;
  }
  .pso-form-sub__r {
    width: 50%;
  }
  .pso-form-sub__subtab {
    width: 100%;
    position: absolute;
    background-color: #fff;
    z-index: 2;
  }
  .pso-form-sub__form {
    margin-top: 54px;
  }
}
</style>
