<template>
  <common-panel :cpnt="cpnt" info="编程化单位" :needPlaceholder="true" :needDefaultValue="false">
    <el-form-item label="单位源类型">
      <el-select v-model="dataType" clearable>
        <el-option
          v-for="item in treeTypes"
          :key="item.data_type"
          :label="item.feildname"
          :value="item.data_type"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联显示单位">
      <el-select v-model="cpnt.data._relateUnit" placeholder="请选择">
        <el-option
          v-for="item in selectOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联展示单位">
      <el-select v-model="cpnt.data._relateDisUnitName" placeholder="请选择">
        <el-option
          v-for="item in textOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联数量">
      <el-select v-model="cpnt.data._relateNum" placeholder="请选择">
        <el-option
          v-for="item in numOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联计量数量">
      <el-select v-model="cpnt.data._relateStandardNum" placeholder="请选择">
        <el-option
          v-for="item in numOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联单价">
      <el-select v-model="cpnt.data._relatePrice" placeholder="请选择">
        <el-option
          v-for="item in moneyOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联汇总">
      <el-select v-model="cpnt.data._relateSummary" placeholder="请选择">
        <el-option
          v-for="item in moneyOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联仓库">
      <el-select v-model="cpnt.data._relateWarehouse" placeholder="请选择">
        <el-option
          v-for="item in warehouseOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联最小单位">
      <el-select v-model="cpnt.data._relateStandardUnit" placeholder="请选择">
        <el-option
          v-for="item in textOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联标签显示名称">
      <el-select v-model="cpnt.data._relateName" placeholder="请选择">
        <el-option
          v-for="item in textOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      treeTypes: [],
      dataType: ""
    };
  },
  computed: {
    tagIdName() {
      return this.cpnt.data._source === "tree" ? "node_id" : "tag_no";
    },
    tagDisplayName() {
      return this.cpnt.data._source === "tree" ? "node_name" : "tag_name";
    },
    numOptions() {
      return this.cpnt.store.search({ options: { componentid: "number" }, onlyData: true, onlyMain: true });
    },
    selectOptions() {
      return this.cpnt.store.search({ options: { componentid: "select" }, onlyData: true, onlyMain: true });
    },
    moneyOptions() {
      return this.cpnt.store.search({ options: { componentid: "money" }, onlyData: true, onlyMain: true });
    },
    warehouseOptions() {
      return this.cpnt.store.search({ options: { componentid: "tag" }, onlyData: true, onlyMain: true });
    },
    textOptions() {
      return this.cpnt.store.search({ options: { componentid: "text" }, onlyData: true, onlyMain: true });
    }
  },
  watch: {
    dataType: {
      handler(val) {
        if (val) {
          const option = _.find(this.treeTypes, { data_type: val });
          if (option) {
            this.cpnt.data._treeOptions = `${val},${option.feildvalue}`;
          }
        } else {
          this.cpnt.data._treeOptions = "";
        }
      }
    }
  },
  async created() {
    const ret = await this.API.getCommonType({ skey: "GetTagTypeBar" });
    this.treeTypes = ret.data;
  }
};
</script>
