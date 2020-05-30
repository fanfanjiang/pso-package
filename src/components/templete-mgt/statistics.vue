<template>
  <div class="pso-tp-statistics">
    <el-table key="list" :data="data" style="width: 100%" height="300">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="字段">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.field" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示名名称">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.width"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="顺序">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.number"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="form" label-width="80px" style="margin-top:20px">
      <el-form-item label="数据源">
        <el-input type="textarea" v-model="source"></el-input>
      </el-form-item>
      <el-form-item label="约束">
        <el-input v-model="restrain"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveTp">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ["node", "data"],
  data() {
    return {
      source: "",
      restrain: ""
    };
  },
  created() {},
  methods: {
    async saveTp() {
      const ret = await this.API.templates({
        data: {
          tp_code: this.node.node_name,
          route_setting: this.restrain,
          data_list: this.source
        },
        method: "put"
      });
    }
  }
};
</script>