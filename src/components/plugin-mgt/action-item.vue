<template>
  <div>
    <picker-form :data="data" form-field="code" position="left" source="3" @loaded="loadedHandler"></picker-form>
    <el-form label-position="left" size="mini" label-width="90px">
      <el-form-item label="动作" style="margin-bottom: 10px">
        <el-select size="mini" multiple clearable v-model="data.actionIds">
          <el-option v-for="(a, i) in actions" :key="i" :label="a.name" :value="a.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button style="margin: 10px 0 10px 0" size="mini" type="success" plain @click="addHandler">新增字段关系</el-button>
    <el-table key="status" size="mini" border :data="data.trans" style="width: 100%">
      <el-table-column label="统计字段">
        <template slot-scope="scope">
          <el-select clearable filterable size="mini" v-model="scope.row.sf">
            <el-option v-for="(d, i) in column" :key="i" :label="d.name" :value="d.field"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="表单字段">
        <template slot-scope="scope">
          <el-select clearable filterable size="mini" v-model="scope.row.tf">
            <el-option v-for="(f, i) in fields" :key="i" :label="f.fieldDisplay" :value="f._fieldValue"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import PickerForm from "../picker/pso-picker-form";
export default {
  components: { PickerForm },
  props: {
    data: Object,
    column: Array,
  },
  data() {
    return {
      fields: [],
      actions: [],
    };
  },
  methods: {
    loadedHandler({ fields, config }) {
      this.fields = fields;
      const { data_button } = config;
      if (data_button) {
        this.actions = JSON.parse(data_button);
      }
    },
    addHandler() {
      this.data.trans.push({ tf: "", sf: "" });
    },
    delHandler(index) {
      this.data.trans.splice(index, 1);
    },
  },
};
</script>