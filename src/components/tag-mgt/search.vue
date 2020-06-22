<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler">添加查询规则</el-button>
    </div>
    <el-table :data="tag.tag_rule" style="width: 100%">
      <el-table-column label="表单" width="160">
        <template slot-scope="scope">
          <el-select
            size="mini"
            v-model="scope.row.data_code"
            placeholder="请选择"
            @change="formChangeHandler($event,scope.row)"
          >
            <el-option
              v-for="item in forms"
              :key="item.node_name"
              :label="item.node_display"
              :value="item.node_name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="字段" width="120">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.field_name" placeholder="请选择">
            <el-option
              v-for="item in scope.row.fields"
              :key="item.field_name"
              :label="item.display"
              :value="item.field_name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="规则" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rule" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";
export default {
  mixins: [formOp],
  props: ["tag"],
  data() {
    return {
      forms: [],
      fields: []
    };
  },
  async created() {
    this.forms = await this.API.getFormTree();
    if (!this.tag.tag_rule) {
      this.$set(this.tag, "tag_rule", []);
    } else {
      for (let item of this.tag.tag_rule) {
        await this.formChangeHandler(item.data_code, item);
      }
    }
  },
  methods: {
    addHandler() {
      this.tag.tag_rule.push({ data_code: "", field_name: "", fields: [], rule: "" });
    },
    async formChangeHandler(data_code, row) {
      const formStore = await this.makeFormStore(data_code);
      const ret = await this.API.getFormDict({ data_code });
      row.fields = [];
      ret.data.forEach(item => {
        if (item) {
          const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
          item.display = item.display_name || (field ? field._fieldName : "");
          row.fields.push(item);
        }
      });
    },
    delHandler(index) {
      this.tag.tag_rule.splice(index, 1);
    }
  }
};
</script>