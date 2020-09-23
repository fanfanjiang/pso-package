<template>
  <div>
    <el-table key="formupload" size="mini" :data="data" style="width: 100%" height="500">
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
    data: Array,
    code: String,
    store: Object,
  },
  data() {
    this.option = FIELD_FORMAT;
    return {};
  },
  async created() {
    const fields = await this.API.getFormDict({ data_code: this.code, is_convert: "1" });
    assignList({
      target: this.data,
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
  },
  methods: {},
};
</script>