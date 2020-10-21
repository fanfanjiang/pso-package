<template>
  <div class="pso-form-sub" :class="cpntClass" v-loading="saving">
    <div class="pso-form-sub__l">
      <pso-form-view
        ref="mainTable"
        key="main"
        v-bind="params"
        :params="params"
        :addable="false"
        :deletable="false"
        :edtail-editable="false"
        :table-row-click="mainClick"
        :def-limit="20"
        :title-text="params.menu_name"
        @initialized="mainLoaded"
        @data-loaded="formDataLoadedHandler"
      >
      </pso-form-view>
    </div>
    <div class="pso-form-sub__r" v-loading="initializing||loadingSub">
      <template v-if="curRow">
        <pso-form-view ref="assTable" key="assTable" v-bind="assParams" :params="assParams"></pso-form-view>
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
      loadingSub: false,
      saving: false,
      dataId: "",
      curRow: null,
    };
  },
  computed: {
    cpntClass() {
      return {
        displayRow: this.params.displayRow === "1",
      };
    },
    assParams() {
      let defForm = null;
      const params = {};
      if (this.curRow) {
        if (this.params.sourceField && this.params.targetField) {
          defForm = {
            [this.params.targetField]: this.curRow[this.params.sourceField],
          };
        }
      }
      for (let key in this.params) {
        if (/^ass__/.test(key)) {
          params[key.replace("ass__", "")] = this.params[key];
        }
      }
      return { ...this.params, ...params, defForm };
    },
  },
  methods: {
    async mainLoaded({ store, cfg, defForm }) {
      this.defForm = defForm;
      this.initializing = false;
    },
    mainClick(row) {
      this.loadingSub = true;
      this.dataId = row.leaf_id;
      this.curRow = row;
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
      height: 40%;
      overflow-y: auto;
    }
    .pso-form-sub__r {
      width: 100%;
      height: 60%;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      z-index: 2;
      padding: 0 15px 15px 15px;
    }
  }
  .pso-form-sub__l {
    width: 30%;
  }
  .pso-form-sub__r {
    width: 70%;
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
