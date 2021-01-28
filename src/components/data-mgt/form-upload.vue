<template>
  <div v-loading="initializing" style="margin-top: 10px">
    <el-form size="mini" label-position="left" label-width="120px">
      <el-form-item label="是否流程">
        <el-switch size="mini" v-model="data.is_wf" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="流程" v-if="data.is_wf === '1'">
        <el-select clearable size="mini" v-model="data.wf_code">
          <el-option v-for="(w, i) in workflows" :key="i" :label="w.node_display" :value="w.node_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联子表">
        <el-switch size="mini" v-model="data.relate_table" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="关联方式">
        <el-input size="mini" v-model="data.relate_type" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="唯一关联字段">
        <el-select size="mini" v-model="data.relate_unique" filterable clearable>
          <el-option v-for="(f,i) in fields" :key="i" :label="f.field_display" :value="f.field_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联子表配置">
        <el-input size="mini" v-model="data.childTable" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-table key="formupload" size="mini" :data="data.mainfields" style="width: 100%" height="500">
      <el-table-column type="index" :index="1" fixed="left"></el-table-column>
      <el-table-column prop="field" label="字段" width="100" fixed="left"></el-table-column>
      <el-table-column prop="enable" label="启用" width="90" sortable>
        <template slot-scope="scope">
          <el-switch size="mini" v-model="scope.row.enable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="160" sortable>
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.type" clearable>
            <el-option v-for="o in option" :key="o.value" :label="o.label" :value="o.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template> 
<script>
import { FORM_UPLOAD_FIELDS } from "../../const/sys";
import { FIELD_FORMAT } from "../../const/form";
import { assignList } from "../../utils/util";
export default {
  props: {
    data: Object,
    code: String,
    store: Object,
    fields: Array,
  },
  data() {
    this.option = FIELD_FORMAT;
    this.workflows = [];
    return {
      initializing: false,
    };
  },
  async created() {
    this.initializing = true;

    this.workflows = await this.API.getWfTree();
    const fields = await this.API.getFormDict({ data_code: this.code, is_convert: "1" });

    assignList({
      target: this.data.mainfields,
      source: fields.data,
      tid: "field",
      sid: "Field",
      base: FORM_UPLOAD_FIELDS,
      assemble: (sf) => {
        const field = this.store.searchByField(sf.Field, true);
        return {
          field: sf.Field,
          name: field ? field._fieldName : "",
          enable: !!field,
        };
      },
    });

    this.initializing = false;
  },
  methods: {},
};
</script>