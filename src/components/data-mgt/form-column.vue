<template>
  <div class="pso-data-mgt__column">
    <div class="pso-table-controller">
      <el-button size="small" @click="$emit('save')">保存</el-button>
    </div>
    <el-table key="list" :data="data" style="width: 100%" height="500">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column prop="field_name" label="字段" width="180"></el-table-column>
      <el-table-column label="显示名名称">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.display_name" placeholder></el-input>
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
      <el-table-column label="启用" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.using" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_show" active-value="1" inactive-value="0"></el-switch>
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
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    handleSave() {}
  }
};
</script>