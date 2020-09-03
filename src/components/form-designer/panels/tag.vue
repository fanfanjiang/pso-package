<template>
  <common-panel :cpnt="cpnt" info="可以选择标签插入表单" :needPlaceholder="true" :needDefaultValue="false">
    <el-form-item label="源类型">
      <el-radio-group size="small" v-model="cpnt.data._source" @change="handleSourceChange">
        <el-radio label="tree">树节点</el-radio>
        <el-radio label="table">列表</el-radio>
        <el-radio label="data">数据</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="单选多选">
      <el-radio v-model="cpnt.data._type" label="radio">单选</el-radio>
      <el-radio v-model="cpnt.data._type" label="checkbox">多选</el-radio>
    </el-form-item>
    <el-form-item label="值类型">
      <el-select size="small" v-model="dataType" clearable>
        <el-option
          v-for="item in treeTypes"
          :key="item.dimen_tag"
          :label="item.tag_name"
          :value="item.dimen_tag"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="默认值">
      <pso-picker-tag
        ref="selector"
        :show="show"
        :tree-option="cpnt.data._treeOptions"
        :pattern="cpnt.data._type"
        :source="cpnt.data._source"
        @cancel="show=false"
        @confirm="handleAddSelection"
      ></pso-picker-tag>
      <div :key="cpnt.fid">
        <el-tag
          v-for="item in proxy.list"
          :key="item[tagIdName]"
          closable
          @close="handleDelSelection(item)"
        >{{item[tagDisplayName]}}</el-tag>
      </div>
    </el-form-item>
    <el-form-item label="设置">
      <el-switch size="mini" v-model="cpnt.data._copy" active-text="为表单赋值"></el-switch>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import { pickerMixin } from "../../../mixin/picker";

export default {
  props: ["cpnt"],
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  components: {
    commonPanel,
  },
  data() {
    return {
      treeTypes: [],
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
      dataType: "",
    };
  },
  computed: {
    tagIdName() {
      return this.cpnt.data._source === "tree" ? "node_id" : "tag_no";
    },
    tagDisplayName() {
      return this.cpnt.data._source === "tree" ? "node_display" : "tag_name";
    },
  },
  watch: {
    "proxy.list": {
      deep: true,
      handler(val) {
        this.cpnt.data._defaultValue = val.map((item) => item[this.tagIdName]).join(",");
      },
    },
    "cpnt.data._type": {
      handler(val) {
        this.proxy.type = val;
      },
    },
    dataType: {
      handler(val) {
        if (val) {
          const option = _.find(this.treeTypes, { dimen_tag: val });
          if (option) {
            this.cpnt.data._treeOptions = `${val},${option.dimen_tag}`;
          }
        } else {
          this.cpnt.data._treeOptions = "";
        }
      },
    },
  },
  async created() {
    this.handleSourceChange();
    const ret = await this.API.getTreeDimen({ limit: 999999, page: 0 });
    this.treeTypes = ret.data.filter((d) => d.node_dimen === 5);
    this.init();
  },
  methods: {
    async init() {
      //初始化
      if (this.cpnt.data._treeOptions) {
        this.dataType = this.cpnt.data._treeOptions.split(",")[0];
      }
      if (!this.cpnt.data._defaultValue) return;
      let defaultVal = this.cpnt.data._defaultValue.split(",");
      let ret = { data: [] };
      let idName = "";
      if (this.cpnt.data._source === "tree") {
        ret = await this.API.trees({ data: { dimen: 5 } });
        idName = "node_id";
        defaultVal = defaultVal.map((val) => parseInt(val));
      } else {
        ret = await this.API.tag({ data: { keys: JSON.stringify({}), page: 0, limit: 9999999 } });
        idName = "tag_no";
      }
      ret.data.forEach((item) => {
        if (defaultVal.indexOf(item[idName]) !== -1) this.proxy.list.push(item);
      });
    },
    handleSourceChange() {
      this.resetPicker({ idName: this.tagIdName });
    },
  },
};
</script>
