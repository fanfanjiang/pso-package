<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div class="pso-form-selectedlist" v-if="proxy.list.length&&!loading">
      <el-tag
        v-for="item in proxy.list"
        :key="item[tagIdName]"
        :closable="cpnt.store.editable&&!cpnt.data._read"
        @close="handleDelTag(item)"
      >{{item[tagDisplayName]}}</el-tag>
    </div>
    <pso-skeleton v-if="loading" :lines="1"></pso-skeleton>
    <pso-picker-tag
      v-if="cpnt.store.editable&&!cpnt.data._read"
      ref="selector"
      :show="show"
      :tree-option="cpnt.data._treeOptions"
      :pattern="cpnt.data._type"
      :source="cpnt.data._source"
      @cancel="show=false"
      @confirm="handlePickTag"
    ></pso-picker-tag>
  </el-form-item>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
      units: [],
    };
  },
  computed: {
    tagIdName() {
      return "tag_no";
    },
    tagDisplayName() {
      return "tag_name";
    },
    standardUnit() {
      return _.find(this.units, { is_base: 1 });
    },
    relateUnit() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateUnit } });
    },
    relateNum() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateNum } });
    },
    relateStandardNum() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateStandardNum } });
    },
    relatePrice() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relatePrice } });
    },
    relateSummary() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateSummary } });
    },
    relateStandardUnit() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateStandardUnit } });
    },
    relateDisUnitName() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateDisUnitName } });
    },
    relateName() {
      return this.cpnt.store.search({ options: { fid: this.cpnt.data._relateName } });
    },
  },
  async created() {
    this.resetPicker({ idName: this.tagIdName, reset: false });

    //初始化事件
    this.$on("cpnt-value-changed", ({ cpnt }) => {
      if (this.relateUnit === cpnt || this.relateNum === cpnt) {
        this.handleValChange();
      }
    });
    if (this.cpnt.data._val) {
      this.loading = true;
      const ret = await this.API.tag({
        data: { keys: JSON.stringify({ tag_no: { value: this.cpnt.data._val, type: 1 } }), start: 0, limit: 9999999 },
      });
      if (ret.success && ret.data && ret.data.length) {
        this.proxy.list.push(ret.data[0]);
        await this.handlePick();
      }
      this.loading = false;
    }
  },
  methods: {
    handlePickTag(data) {
      this.handleAddSelection(data);
      if (data && data.length) {
        this.cpnt.data._val = _.map(data, this.tagIdName).join(",");
      } else {
        this.cpnt.data._val = "";
      }
      this.handlePick(true);
    },
    handleDelTag(data) {
      this.handleDelSelection(data);
      this.cpnt.data._val = "";
      this.handlePick(true);
    },
    async handlePick(forceReset = false) {
      //初始化
      if (this.cpnt.data._val) {
        if (this.relateName) {
          this.relateName.data._val = this.proxy.list[0].tag_name;
        }

        const ret = await this.API.getTagAttribute({ tag_no: this.cpnt.data._val });
        if (ret.success && ret.data) {
          this.units = ret.data;
        }
      } else {
        this.units = [];
      }

      //初始化单位
      if (this.relateUnit) {
        this.relateUnit.data._option = this.units.map((item) => ({ _optionValue: item.c_code, _optionName: item.c_specs }));
        if (forceReset) this.relateUnit.data._val = "";
      }

      if (this.relateStandardUnit) {
        this.relateStandardUnit.data._val = this.standardUnit ? this.standardUnit.c_code : "";
      }

      this.handleValChange();
    },
    handleValChange() {
      if (!this.relateUnit) return;
      const c_code = this.relateUnit.data._val;
      const currentUnit = _.find(this.units, { c_code });

      //关联仅仅显示单位
      if (this.relateDisUnitName) {
        this.relateDisUnitName.data._val = currentUnit ? currentUnit.c_specs : "";
      }

      //初始化单价
      if (this.relatePrice) {
        this.relatePrice.data._val = currentUnit ? currentUnit.c_price : "";
      }

      if (!this.relateNum) return;

      const num = parseInt(this.relateNum.data._val || 0);
      const standardNum = currentUnit ? currentUnit.c_multiple * num : 0;

      //计量数量
      if (this.relateStandardNum) {
        this.relateStandardNum.data._val = standardNum;
      }

      //总额统计
      if (this.relateSummary) {
        this.relateSummary.data._val = standardNum * (this.standardUnit ? this.standardUnit.c_multiple : 0);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-selectedlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>
