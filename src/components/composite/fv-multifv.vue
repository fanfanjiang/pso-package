<template>
  <div :class="layoutClass" v-loading="saving">
    <div class="lay-vv__t" :style="topStyle">
      <pso-form-view
        key="main"
        v-bind="params"
        :params="{ ...params, hideAuthTab: true }"
        :def-limit="20"
        :table-row-click="mainRowClickHandler"
        simple-pagination
        @initialized="handleInitialized"
        @data-loaded="mainLoadedHandler"
      >
      </pso-form-view>
    </div>
    <div class="lay-vv__b" :style="bottomStyle" v-loading="initializing">
      <div class="lay-vv__b-header">
        <el-tabs v-model="tab" @tab-click="onChangeRelate">
          <el-tab-pane :label="r.name" :name="i + ''" v-for="(r, i) in relations" :key="i"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="lay-vv__b__body multifv" v-if="mainCurRow && curRelate">
        <div class="interpreter-wrapper" v-if="curRelate.cid === 'pso-form-interpreter'">
          <pso-form-interpreter v-bind="relateParams"></pso-form-interpreter>
        </div>
        <pso-form-view
          v-else
          key="body"
          v-bind="relateParams"
          :params="relateParams"
          @data-changed="bodyChangeHandler"
          @actioned="bodyChangeHandler"
        ></pso-form-view>
      </div>
    </div>
  </div>
</template>
<script>
import { FormAsMainMixin } from "../../mixin/composite";
export default {
  mixins: [FormAsMainMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      saving: false,
      tab: "0",
      curRelate: null,
    };
  },
  computed: {
    opable() {
      return !!this.params.opable;
    },
    relations() {
      return this.params.relateto;
    },
    relateParams() {
      if (this.mainCurRow && this.curRelate) {
        const { fid, relate, opts, cid } = this.curRelate;
        if (cid === "pso-form-interpreter") {
          if (relate && relate.length) {
            return { formId: fid, dataId: this.mainCurRow[relate[0]["src"]], editable: false };
          }
        } else {
          const params = { viewAuth: this.params.viewAuth };

          if (opts) {
            for (let item of opts) {
              if (typeof params[item.field] === "undefined") {
                params[item.field] = item.value;
              }
            }
          }

          if (relate) {
            params.defForm = {};
            for (let item of relate) {
              if (item.trg && typeof this.mainCurRow[item.src] !== "undefined" && this.mainCurRow[item.src] !== "") {
                params.defForm[item.trg] = this.mainCurRow[item.src];
              }
            }
          }
          params.hideViewTitle = true;
          params.hideAuthTab = true;
          return params;
        }
      }
    },
  },
  created() {
    if (this.relations.length) {
      this.onChangeRelate();
    }
  },
  methods: {
    async handleInitialized(option) {
      this.mainInitedHandler(option);
      this.initializing = false;
    },
    async bodyChangeHandler(data) {
      const { op, leaf_id: changed } = data;
      const { feed } = this.curRelate;

      if ((feed && op == 1) || op == 3) {
        const leaf_id = this.mainDataId;
        const { data_code } = this.vStore.store;
        const value = this.mainCurRow[feed] ? this.mainCurRow[feed].split(",") : [];
        if (op == 1) {
          value.push(changed);
        } else {
          const index = value.indexOf(changed);
          if (index !== -1) {
            value.splice(index, 1);
          }
        }

        await this.vStore.addOrUpdate(
          { leaf_id, formData: { dataArr: [{ leaf_id, [feed]: value.join(",") }], data_code } },
          false,
          false,
          false
        );
      }

      this.vStore.deReloadInstance(this.mainDataId);
    },
    onChangeRelate() {
      this.curRelate = null;
      this.$nextTick(() => {
        this.curRelate = this.relations[parseInt(this.tab)];
      });
    },
  },
};
</script>
<style lang="less">
.interpreter-wrapper {
  height: 100%;
  overflow: auto;
  background-color: #f8f8f8;
  padding: 15px;
}
</style>
