<template>
  <div v-loading="initializing" style="margin-top: 20px">
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>基础配置</span>
      </template>
      <el-form size="mini" label-position="left" label-width="120px" :inline="true">
        <el-form-item label="是否流程">
          <el-switch size="mini" v-model="data.is_wf" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="流程" v-if="data.is_wf === '1'">
          <el-select clearable filterable size="mini" v-model="data.wf_code">
            <el-option v-for="(w, i) in workflows" :key="i" :label="w.node_display" :value="w.node_name"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="关联子表">
          <el-switch size="mini" v-model="data.relate_table" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="关联方式">
          <el-input size="mini" v-model="data.relate_type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一关联字段">
          <el-select size="mini" v-model="data.relate_unique" filterable clearable>
            <el-option v-for="(f, i) in fields" :key="i" :label="f.field_display" :value="f.field_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联子表配置">
          <el-input size="mini" v-model="data.childTable" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
    </great-panel>
    <div style="margin-top: 20px">
      <el-button size="mini" type="primary" plain @click="translate">重置</el-button>
    </div>
    <el-table
      border
      size="mini"
      height="430"
      style="width: 100%; margin-top: 5px"
      :data="data.mainfields"
      :default-sort="{ prop: 'enable', order: 'descending' }"
    >
      <el-table-column prop="field" label="字段" width="110"></el-table-column>
      <el-table-column prop="enable" label="启用" width="70" align="center" sortable>
        <template slot-scope="scope">
          <el-switch size="mini" v-model="scope.row.enable"></el-switch>
        </template>
      </el-table-column> 
      <el-table-column label="条件" width="70" align="center" sortable>
        <template slot-scope="scope">
          <el-switch size="mini" v-model="scope.row.is_condition" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120" align="center" sortable>
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.type" clearable @change="checkRelate($event, scope.row)">
            <el-option v-for="o in option" :key="o.value" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="转换">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.format" :disabled="scope.row.type !== 'common_x'"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="relate_field" label="关联字段" width="180" align="center">
        <template slot-scope="scope">
          <el-select size="mini" placeholder="" v-model="scope.row.relate_field" clearable disabled>
            <el-option v-for="(d, i) in fields" :key="i" :label="d.field_display" :value="d.field_name"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="relate_target" label="目标字段" width="160" align="center"> </el-table-column>
    </el-table>
  </div>
</template> 
<script>
import { FORM_UPLOAD_FIELDS } from "../../const/sys";
import { FIELD_FORMAT } from "../../const/form";
import { assignList } from "../../utils/util";
import GreatPanel from "../great-panel";
const AVAIABLE = ["relate", "common", "common_x", "user", "dept", "tag"];
export default {
  components: { GreatPanel },
  props: { 
    data: Object,
    code: String,
    store: Object,
    fields: Array,
  },
  data() {
    this.option = [{ label: "关联", value: "relate" }].concat(Object.values(FIELD_FORMAT).filter(({ value }) => AVAIABLE.includes(value)));
    this.workflows = [];
    this.sFields = [];
    return {
      initializing: false,
      checking: false,
    };
  },
  async created() {
    this.initializing = true;
    this.workflows = await this.API.getWfTree();
    this.sFields = (await this.API.getFormDict({ data_code: this.code, is_convert: "1" })).data;

    assignList({
      target: this.data.mainfields,
      source: this.sFields,
      tid: "field",
      sid: "Field",
      base: FORM_UPLOAD_FIELDS,
      assemble: (sf) => this.makeField(sf.Field),
    });

    this.initializing = false;
  },
  methods: {
    translate() {
      this.sFields.forEach((sf) => {
        const exist = _.find(this.data.mainfields, { field: sf.Field });
        if (exist) {
          Object.assign(exist, this.makeField(sf.Field));
        }
      });
    },
    makeField(fid) {
      const field = this.store.searchByField(fid, true);
      const data = { ...FORM_UPLOAD_FIELDS, field: fid };
      if (field) {
        const { componentid, _fieldName, _outputFormat, _fieldFormat } = field;
        data.name = _fieldName;
        data.enable = componentid !== "asstable";
        data.format = _outputFormat;
        data.type = AVAIABLE.includes(_fieldFormat) ? _fieldFormat : "common";
      }
      return data;
    },
    async checkRelate(type, data) {
      const field = this.store.searchByField(data.field, true);
      if (type === "relate") {
        if (field && field.componentid === "assfield") {
          const asstable = this.store.search({ options: { fid: field._selectedTable, db: true }, onlyData: true });
          data.format = asstable._option;
          data.relate_field = asstable._fieldValue;
          data.relate_target = field._selectedField;
          this.checking = true;
          this.checking = false;
          return;
        } else {
          this.$message({ type: "warning", message: `非关联字段` });
        }
      }
      data.format = this.makeField(data.field).format || "";
      data.relate_field = "";
      data.relate_target = "";
    },
  },
};
</script>